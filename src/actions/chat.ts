import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { streamText } from 'ai';
import { createSmartProvider } from '@/lib/deepseek';
import { CoreMessage } from 'ai';

const NoteIdSchema = z.number().int().positive();
const SessionIdSchema = z.number().int().positive();

/**
 * Get all QA sessions for a specific note, ordered by creation date.
 * @param noteId The ID of the note.
 * @returns A promise that resolves to an array of QA sessions.
 */
export async function getQASessions(noteId: number) {
  const validation = NoteIdSchema.safeParse(noteId);
  if (!validation.success) {
    return { error: 'Invalid Note ID', sessions: [] };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized', sessions: [] };
  }

  const { data, error } = await supabase
    .from('qa_sessions')
    .select('id, title, created_at')
    .eq('note_id', noteId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching QA sessions:', error);
    return { error: 'Failed to fetch sessions', sessions: [] };
  }

  return { sessions: data };
}

/**
 * Get all messages for a specific QA session.
 * @param sessionId The ID of the QA session.
 * @returns A promise that resolves to an array of QA messages.
 */
export async function getQAMessages(sessionId: number) {
  const validation = SessionIdSchema.safeParse(sessionId);
  if (!validation.success) {
    return { error: 'Invalid Session ID', messages: [] };
  }
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized', messages: [] };
  }

  const { data, error } = await supabase
    .from('qa_messages')
    .select('id, role, content')
    .eq('session_id', sessionId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching QA messages:', error);
    return { error: 'Failed to fetch messages', messages: [] };
  }

  // Map to CoreMessage format
  const messages: CoreMessage[] = data.map(msg => ({
    id: String(msg.id),
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }));

  return { messages };
}

/**
 * The main server action for handling chat conversations.
 * It manages sessions, saves messages, and streams AI responses.
 */
export async function continueConversation({ messages, data }: { messages: CoreMessage[], data?: { noteId: number, sessionId: number | null }}) {
  const { noteId, sessionId: currentSessionId } = data || {};

  // --- 1. Validation ---
  if (!noteId) {
    throw new Error('Note ID is required.');
  }
  const validatedNoteId = NoteIdSchema.safeParse(noteId);
  if (!validatedNoteId.success) {
    throw new Error('Invalid Note ID.');
  }

  // --- 2. Authentication ---
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  // --- 3. Session Management & Message Persistence ---
  const lastUserMessage = messages.findLast(m => m.role === 'user');
  if (!lastUserMessage) {
    throw new Error('No user message found.');
  }

  let sessionId = currentSessionId;

  // Create a new session if one doesn't exist
  if (!sessionId) {
    // Fix for the substring issue - safely extract title from content
    let title = '';
    if (typeof lastUserMessage.content === 'string') {
      title = lastUserMessage.content.substring(0, 100);
    } else if (Array.isArray(lastUserMessage.content) && lastUserMessage.content.length > 0) {
      // Handle array of content parts
      const textPart = lastUserMessage.content.find(part => 'text' in part);
      if (textPart && 'text' in textPart) {
        title = textPart.text.substring(0, 100);
      } else {
        title = 'New conversation';
      }
    }

    const { data: newSession, error } = await supabase
      .from('qa_sessions')
      .insert({
        note_id: noteId,
        user_id: user.id,
        title: title, // Use processed title
      })
      .select('id')
      .single();

    if (error) {
      console.error('Failed to create new session:', error);
      throw new Error('Could not start a new session.');
    }
    sessionId = newSession.id;
  }

  // Save the user's message
  const { error: userMessageError } = await supabase.from('qa_messages').insert({
    session_id: sessionId,
    user_id: user.id,
    role: 'user',
    content: lastUserMessage.content,
  });

  if (userMessageError) {
    console.error('Failed to save user message:', userMessageError);
    // Continue anyway, but the message won't be saved.
  }

  // --- 4. Fetch Note Content for AI Context ---
  const { data: note } = await supabase
    .from('notes')
    .select('content')
    .eq('id', noteId)
    .single();
  
  const noteContent = note?.content || 'No content available for this note.';
  const systemPrompt = `You are an intelligent Q&A assistant. Your task is to answer questions based on the provided note content. Be concise, accurate, and helpful. If the answer is not in the note, say "I cannot find the answer in the provided note content.If user's question is not in the note content but is relevant, answer it based on your knowledge. "\n\n--- NOTE CONTENT ---\n${noteContent}`;

  // --- 5. Stream AI Response with Failover ---
  const smartProvider = await createSmartProvider();

  const processStream = async (provider: 'primary' | 'fallback') => {
    const model = provider === 'primary' ? smartProvider.getModel() : smartProvider.getFallbackModel();
    const providerName = provider === 'primary' ? smartProvider.primary.name : smartProvider.fallback?.name;

    if (!model) {
      throw new Error(`Invalid ${provider} provider model.`);
    }
    console.log(`[CHAT] Attempting stream with ${providerName}...`);

    return streamText({
      model: model,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: 0.1,
      maxTokens: 1000,
      async onFinish({ text }: { text: string }) {
        // Save assistant's response on completion
        if (sessionId) {
          await supabase.from('qa_messages').insert({
            session_id: sessionId,
            user_id: user.id,
            role: 'assistant',
            content: text,
          });
        }
      },
    });
  };

  try {
    const result = await processStream('primary');
    return result.toDataStream();
  } catch (primaryError) {
    console.warn(`[CHAT] ❌ Primary provider (${smartProvider.primary.name}) failed:`, primaryError);
    if (smartProvider.fallback) {
      try {
        const result = await processStream('fallback');
        return result.toDataStream();
      } catch (fallbackError) {
        console.error(`[CHAT] 🚨 Fallback provider (${smartProvider.fallback?.name}) also failed:`, fallbackError);
        throw new Error('Both primary and fallback AI services failed.');
      }
    }
    throw new Error('The primary AI service failed and no fallback is available.');
  }
} 