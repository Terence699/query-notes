import AuthButton from "@/components/AuthButton";
import GetStartedButton from "@/components/GetStartedButton";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full h-screen">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-end items-center p-3 text-sm">
          <AuthButton />
        </div>
      </nav>

      <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-bold mb-4">Welcome to QueryNotes</h1>
        <p className="text-xl text-gray-600 mb-8">
          Don't just take notes. Query Them.
        </p>
        <div className="flex justify-center gap-4">
          <GetStartedButton />
          <Link
            href="/learn-more"
            className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg border border-indigo-600 shadow-md hover:bg-gray-100 transition"
          >
            Learn more →
          </Link>
        </div>
      </div>
      
      <footer className="w-full flex justify-center p-4">
        <p className="text-sm text-gray-500">Build by Yifu Yuan</p>
      </footer>
    </div>
  );
}

