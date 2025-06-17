'use client';

import GetStartedButton from "@/components/GetStartedButton";
import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full h-screen">
      <Navigation />

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

