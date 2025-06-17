'use client';

import GetStartedButton from "@/components/GetStartedButton";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function HomePageContent() {
  const searchParams = useSearchParams();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const welcome = searchParams.get('welcome') === 'true';
    setShowWelcome(welcome);

    if (welcome) {
      // Auto-hide the welcome message after 5 seconds
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col w-full h-screen">
      <Navigation />

      {/* Welcome message positioned above main content */}
      {showWelcome && (
        <div className="flex justify-center px-4 pt-4">
          <div className="animate-in max-w-md">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 shadow-sm">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-green-600 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-sm font-medium text-green-800">
                  🎉 Welcome to QueryNotes!
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Your email has been confirmed and you&apos;re now signed in. Ready to start taking intelligent notes?
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content - always centered regardless of welcome message */}
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-bold mb-4 text-foreground">
          Welcome to <span className="text-primary">Query</span>Notes
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Don&apos;t just take notes. Query Them.
        </p>
        <div className="flex justify-center gap-4">
          <GetStartedButton />
          <Link
            href="/learn-more"
            className="px-6 py-3 bg-background text-primary font-semibold rounded-lg border border-primary shadow-md hover:bg-muted transition"
          >
            Learn more →
          </Link>
        </div>
      </div>

      <footer className="w-full flex justify-center p-4">
        <p className="text-sm text-muted-foreground">Build by Yifu Yuan</p>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}

