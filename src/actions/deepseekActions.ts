'use server';

import { createSmartProvider } from '@/lib/deepseek';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { generateText } from 'ai';

const summarySchema = z.object({
  noteId: z.coerce.number().int().positive(),
});

export async function generateSummary(noteId: string, noteContent: string): Promise<{ error?: string }> {
  const supabase = await createClient();

  // 1. Validate the noteId
  const validatedFields = summarySchema.safeParse({ noteId });
  if (!validatedFields.success) {
    console.error('Invalid ID provided for noteId:', noteId);
    return { error: 'Invalid note ID format.' };
  }
  const validatedNoteId = validatedFields.data.noteId;

  try {
    // 2. Treat content as a plain string and check length
    const plainText = typeof noteContent === 'string' ? noteContent : '';
      
    if (!plainText || plainText.trim().length < 50) {
        return { error: 'Note content is too short to generate a meaningful summary.' };
    }

    // 3. Get smart provider with failover capability
    const smartProvider = await createSmartProvider();
    const systemPrompt = 'You are an expert summarizer. Your task is to provide a concise, clear, and accurate summary of the given text in 1-3 sentences. Focus on the main points and key information. The summary should be returned in the same language as the original text.';
    const userPrompt = `Please summarize the following note content:\n\n---\n\n${plainText}`;

    let summary: string | undefined;
    let lastError: Error | null = null;

    try {
      // Try primary provider first
      console.log(`Attempting summary generation with ${smartProvider.primary.name}...`);
      const result = await generateText({
        model: smartProvider.getModel(),
        system: systemPrompt,
        prompt: userPrompt,
        maxTokens: 200,
        temperature: 0.3,
      });
      summary = result.text;
      console.log(`✅ Summary generated successfully with ${smartProvider.primary.name}`);
    } catch (primaryError) {
      console.warn(`❌ Primary provider (${smartProvider.primary.name}) failed:`, primaryError);
      lastError = primaryError as Error;

      // Try fallback provider if available
      if (smartProvider.fallback) {
        try {
          console.log(`🔄 Attempting fallback with ${smartProvider.fallback.name}...`);
          const fallbackModel = smartProvider.getFallbackModel();
          if (fallbackModel) {
            const result = await generateText({
              model: fallbackModel,
              system: systemPrompt,
              prompt: userPrompt,
              maxTokens: 200,
              temperature: 0.3,
            });
            summary = result.text;
            console.log(`✅ Summary generated successfully with fallback ${smartProvider.fallback.name}`);
          }
        } catch (fallbackError) {
          console.error(`❌ Fallback provider (${smartProvider.fallback.name}) also failed:`, fallbackError);
          lastError = fallbackError as Error;
        }
      }
    }

    if (!summary) {
      console.error('All AI providers failed. Last error:', lastError);
      return { error: 'Failed to generate summary. All AI services are currently unavailable.' };
    }

    // 4. Update the note in the database with the new summary
    const { error: updateError } = await supabase
      .from('notes')
      .update({ summary: summary.trim() })
      .eq('id', validatedNoteId);

    if (updateError) {
      console.error('Error updating note with summary:', updateError);
      return { error: 'Failed to save the summary to the database.' };
    }

    // 5. Revalidate the path to show the updated summary immediately
    revalidatePath(`/notes/${validatedNoteId}`);
    return {}; // Success!

  } catch (error) {
    console.error('An unexpected error occurred during summary generation:', error);
    return { error: 'An unexpected error occurred while contacting the AI model.' };
  }
} 