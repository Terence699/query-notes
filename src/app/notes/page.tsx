import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createNote } from "@/actions/notes";
import NotesSearchPage from "@/components/NotesSearchPage";
import { NewNoteButton } from "@/components/NewNoteButton";

// 这是一个服务器组件，用于显示用户的笔记列表
export default async function NotesPage() {
  const supabase = await createClient();

  // 获取当前用户信息
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 如果用户未登录，则重定向到登录页面
  if (!user) {
    return redirect("/login");
  }

  // 从数据库中获取当前用户的所有笔记，并获取更多信息用于卡片展示
  const { data: notes, error } = await supabase
    .from("notes")
    .select("id, title, content, updated_at")
    .order("updated_at", { ascending: false });
  
  // 如果查询出错，显示错误信息
  if (error) {
    console.error("Error fetching notes:", error);
    return <p>Sorry, something went wrong while fetching your notes.</p>;
  }

  return (
    <div className="flex-1 w-full flex flex-col">
      {/* Page Header */}
      <header className="w-full flex justify-center border-b border-b-foreground/10">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 text-sm">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
              &larr; Home
            </Link>
            <h1 className="text-lg font-semibold text-gray-800">Notes</h1>
          </div>
          <form action={createNote}>
            <NewNoteButton />
          </form>
        </div>
      </header>
      
      {/* Page Content with Search */}
      <main className="w-full max-w-5xl mx-auto p-4 flex-grow">
        <NotesSearchPage initialNotes={notes || []} />
      </main>
    </div>
  );
} 