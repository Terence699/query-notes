"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Creates a new note in the database for the current user.
 * After creation, it revalidates the notes list and redirects the user
 * to the new note's editor page.
 */
export async function createNote() {
  const supabase = await createClient();

  // 1. Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return redirect("/login");
  }

  // 2. Create a new note in the database
  //    We only need to provide the user_id, as other fields have default values.
  const { data, error } = await supabase
    .from("notes")
    .insert({ user_id: user.id })
    .select("id")
    .single(); // .single() is crucial to get a single object back, not an array

  if (error) {
    console.error("Error creating note:", error);
    // Optionally, redirect to the notes page with an error message
    return redirect("/notes?message=Could not create note");
  }

  // 3. Revalidate the path to ensure the new note appears in the list
  revalidatePath("/notes");

  // 4. Redirect to the new note's page for editing
  redirect(`/notes/${data.id}`);
}

/**
 * Updates a specific note in the database.
 * @param formData - The form data containing the note's id, title, and content.
 */
export async function updateNote(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  const supabase = await createClient();

  // 1. Get the current user to ensure they are logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  // 2. Attempt to update the note.
  //    RLS policy ensures the user can only update their own notes.
  const { error } = await supabase
    .from("notes")
    .update({ title, content })
    .eq("id", id);

  if (error) {
    console.error("Error updating note:", error);
    return;
  }
}

/**
 * Updates a note without redirecting (for auto-save functionality).
 * @param formData - The form data containing the note's id, title, and content.
 * @returns Promise<{success: boolean, error?: string}>
 */
export async function updateNoteAutoSave(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  const supabase = await createClient();

  // 1. Get the current user to ensure they are logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  // 2. Attempt to update the note.
  //    RLS policy ensures the user can only update their own notes.
  const { error } = await supabase
    .from("notes")
    .update({ 
      title, 
      // We assume content is a simple string for now.
      // We'll parse it as JSON if it's a valid JSON string.
      content: (() => {
        try {
          return JSON.parse(content);
        } catch {
          return content;
        }
      })() 
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating note:", error);
    return { success: false, error: "Could not save note" };
  }

  // 3. Revalidate both the note detail page and the notes list page
  revalidatePath(`/notes`);
  revalidatePath(`/notes/${id}`);
  
  return { success: true };
}

/**
 * Deletes a specific note from the database.
 * @param noteId - The ID of the note to delete.
 */
export async function deleteNote(noteId: string) {
  const supabase = await createClient();

  // 1. Ensure the user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  // 2. Attempt to delete the note. RLS policy will enforce ownership.
  const { error } = await supabase.from("notes").delete().eq("id", noteId);

  if (error) {
    console.error("Error deleting note:", error);
    // In a real app, you might want to handle this more gracefully
    // For now, we'll redirect back to the main notes page with an error.
    return redirect("/notes?message=Could not delete note.");
  }

  // 3. Revalidate the notes list page to reflect the deletion
  revalidatePath("/notes");

  // 4. Redirect the user back to the notes list
  redirect("/notes");
}

/**
 * Searches notes by title and content.
 * @param query - The search query string
 * @returns Promise<Array> - Array of matching notes
 */
export async function searchNotes(query: string) {
  const supabase = await createClient();

  // 1. Ensure the user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  // 2. If query is empty, return all notes
  if (!query.trim()) {
    const { data: notes, error } = await supabase
      .from("notes")
      .select("id, title, content, updated_at")
      .order("updated_at", { ascending: false });
    
    return error ? [] : notes || [];
  }

  // 3. Search notes by title only (content search will be implemented in Phase 2)
  const { data: notes, error } = await supabase
    .from("notes")
    .select("id, title, content, updated_at")
    .ilike('title', `%${query}%`)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error searching notes:", error);
    return [];
  }

  return notes || [];
} 