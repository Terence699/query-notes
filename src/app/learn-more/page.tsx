import Link from 'next/link';
import AuthButton from '@/components/AuthButton';

export default function LearnMorePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-end items-center p-3 text-sm">
          <AuthButton />
        </div>
      </nav>

      <main className="flex-grow w-full max-w-4xl mx-auto px-6 py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          What is QueryNotes?
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          Don't just take notes. <strong>Query Them.</strong>
        </p>

        <div className="space-y-10 text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold mb-3">Our Philosophy</h2>
            <p>
              QueryNotes is built on a simple yet powerful idea: your notes should be more than just static text. They are a living repository of your knowledge, ideas, and discoveries. By combining an elegant, minimalist design with powerful AI, we create a note-taking experience that is both beautiful to use and incredibly intelligent. We help you unlock the value hidden within your own words.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Core Features</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>AI-Powered Q&A:</strong> Ask questions directly to your notes and get intelligent, context-aware answers.</li>
              <li><strong>Instant Summaries:</strong> Condense long-form notes into concise summaries with a single click.</li>
              <li><strong>Advanced Search:</strong> Find what you need instantly with a fast and intuitive global search.</li>
              <li><strong>Secure & Private:</strong> Built with Supabase, your data is secure and always under your control.</li>
              <li><strong>Minimalist Design:</strong> A clean, distraction-free interface that puts your content first.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Our Vision</h2>
            <p>
              We're just getting started. Our roadmap includes rich text editing, collaboration features, advanced note organization with folders and tags, and even deeper AI integrations to help you connect ideas across your entire knowledge base.
            </p>
          </section>

          <section className="text-center mt-16">
            <Link
              href="/"
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
            >
              Back to Home
            </Link>
          </section>
        </div>
      </main>

      <footer className="w-full flex flex-col items-center justify-center p-6 border-t">
        <p className="text-sm text-gray-500 mb-2">
          Contact: yifuyuanyf@outlook.com
        </p>
        <p className="text-sm text-gray-500">
          Personal Website: yifuyuantech.com
        </p>
      </footer>
    </div>
  );
} 