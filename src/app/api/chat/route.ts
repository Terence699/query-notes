import { streamText } from 'ai';
import { createSmartProvider } from '@/lib/deepseek';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

const chatRequestSchema = z.object({
  noteId: z.coerce.number().int().positive(),
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system', 'data']),
      content: z.string(),
    })
  ),
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // Check for authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const validated = chatRequestSchema.safeParse(json);

    if (!validated.success) {
      return new Response(JSON.stringify({ error: 'Invalid request format.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { noteId, messages } = validated.data;

    // Fetch note content
    const { data: note } = await supabase
        .from('notes')
        .select('content')
        .eq('id', noteId)
        .single();
    
    const noteContent = note?.content || 'No content available for this note.';

    const systemPrompt = `You are an intelligent Q&A assistant. Your task is to answer questions based ONLY on the provided note content. Be concise, accurate, and helpful. If the answer is not in the note, say "I cannot find the answer in the provided note content."\n\n--- NOTE CONTENT ---\n${noteContent}`;

    // Get smart provider with failover capability
    const smartProvider = await createSmartProvider();
    
    let result;
    let lastError: Error | null = null;

    try {
      // Try primary provider first
      console.log(`[CHAT] Attempting stream with ${smartProvider.primary.name}...`);
      result = await streamText({
        model: smartProvider.getModel(),
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.1,
        maxTokens: 1000,
      });
      console.log(`[CHAT] ✅ Stream started successfully with ${smartProvider.primary.name}`);
    } catch (primaryError) {
      console.warn(`[CHAT] ❌ Primary provider (${smartProvider.primary.name}) failed:`, primaryError);
      lastError = primaryError as Error;

      // Try fallback provider if available
      if (smartProvider.fallback) {
        try {
          console.log(`[CHAT] 🔄 Attempting fallback stream with ${smartProvider.fallback.name}...`);
          const fallbackModel = smartProvider.getFallbackModel();
          if (fallbackModel) {
            result = await streamText({
              model: fallbackModel,
              messages: [
                { role: 'system', content: systemPrompt },
                ...messages
              ],
              temperature: 0.1,
              maxTokens: 1000,
            });
            console.log(`[CHAT] ✅ Stream started successfully with fallback ${smartProvider.fallback.name}`);
          }
        } catch (fallbackError) {
          console.error(`[CHAT] ❌ Fallback provider (${smartProvider.fallback.name}) also failed:`, fallbackError);
          lastError = fallbackError as Error;
        }
      }
    }

    if (!result) {
      console.error('[CHAT] All AI providers failed. Last error:', lastError);
      return new Response(JSON.stringify({ 
        error: 'All AI services are currently unavailable. Please try again later.' 
      }), { 
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Respond with the stream
    return result.toDataStreamResponse();

  } catch (error) {
    console.error('[CHAT API ERROR]', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: `An unexpected error occurred: ${errorMessage}` }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 