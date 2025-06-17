'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createNote } from "@/actions/notes";
import NotesSearchPage from "@/components/NotesSearchPage";
import { NewNoteButton } from "@/components/NewNoteButton";
import Navigation from "@/components/Navigation";
import { Note } from "@/types/note";

// 这是一个客户端组件，用于显示用户的笔记列表
export default function NotesPage() {
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchNotesAndUser = async () => {
      try {
        const supabase = createClient();

        // 获取当前用户信息
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // 如果用户未登录，则重定向到登录页面
        if (!user) {
          router.push("/login");
          return;
        }

        // 从数据库中获取当前用户的所有笔记，并获取更多信息用于卡片展示
        const { data: notesData, error: notesError } = await supabase
          .from("notes")
          .select("id, title, content, updated_at")
          .order("updated_at", { ascending: false });

        // 如果查询出错，显示错误信息
        if (notesError) {
          console.error("Error fetching notes:", notesError);
          setError("Sorry, something went wrong while fetching your notes.");
          return;
        }

        setNotes(notesData || []);
      } catch (err) {
        console.error("Error:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotesAndUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex-1 w-full flex flex-col">
        <Navigation showHomeLink={true} title="Notes" />
        <main className="w-full max-w-5xl mx-auto p-4 flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 w-full flex flex-col">
        <Navigation showHomeLink={true} title="Notes" />
        <main className="w-full max-w-5xl mx-auto p-4 flex-grow flex items-center justify-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col">
      {/* Page Header */}
      <Navigation showHomeLink={true} title="Notes">
        <form action={createNote}>
          <NewNoteButton />
        </form>
      </Navigation>

      {/* Page Content with Search */}
      <main className="w-full max-w-5xl mx-auto p-4 flex-grow">
        <NotesSearchPage initialNotes={notes || []} />
      </main>
    </div>
  );
} 