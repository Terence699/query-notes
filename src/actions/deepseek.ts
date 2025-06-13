"use server";

import { createClient } from "@/lib/supabase/server";
import { deepseek } from "@/lib/deepseek";
import { generateText } from "ai";
import { revalidatePath } from "next/cache";

export async function generateSummary(noteId: string) {
  const supabase = await createClient();

  // 1. Get the note content from the database
  const { data: note, error: noteError } = await supabase
    .from("notes")
    .select("content")
    .eq("id", noteId)
    .single();

  if (noteError || !note || !note.content) {
    console.error("Error fetching note or note has no content:", noteError);
    return { error: "Could not retrieve note content." };
  }

  const { content } = note;

  // 2. Generate the summary using the DeepSeek API via AI SDK
  try {
    const prompt = `请为以下文本生成一段简明扼要的摘要，摘要内容应该在100字以内，摘要语言和文本语言保持一致，直接输出摘要文本即可，不要包含任何"摘要："或"总结："这样的前缀词。文本内容如下：\n\n${content}`;
    
    const { text: summary } = await generateText({
      model: deepseek.chat('deepseek-chat'),
      system: "You are a helpful assistant that summarizes text.",
      prompt,
    });

    // 3. Update the note in the database with the new summary
    const { error: updateError } = await supabase
      .from("notes")
      .update({ summary })
      .eq("id", noteId);

    if (updateError) {
      console.error("Error updating note with summary:", updateError);
      return { error: "Failed to save the summary." };
    }

    // 4. Revalidate the path to show the updated summary on the page
    revalidatePath(`/notes/${noteId}`);
    return { success: true, summary };

  } catch (e) {
    console.error("Error generating summary with DeepSeek:", e);
    return { error: "Failed to generate summary." };
  }
} 