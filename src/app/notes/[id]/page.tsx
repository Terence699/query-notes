import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NoteEditor from "@/components/NoteEditor";

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const resolvedParams = await params;

  // Validate and convert the ID from URL params
  const noteId = Number(resolvedParams.id);
  if (isNaN(noteId)) {
    console.error("Invalid note ID in URL:", resolvedParams.id);
    redirect("/notes");
  }

  const { data: note, error } = await supabase
    .from("notes")
    .select("id, title, content, summary")
    .eq("id", noteId)
    .single();

  if (error || !note) {
    console.error("Error fetching note or note not found:", error);
    redirect("/notes");
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <NoteEditor note={note} />
    </div>
  );
} 