import Link from 'next/link';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex-1 w-full flex flex-col">
      {/* Page Header */}
      <header className="w-full flex justify-center border-b border-border">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 text-sm">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
              &larr; Home
            </Link>
            <h1 className="text-lg font-semibold text-foreground">Notes</h1>
          </div>
          <div className="bg-muted h-8 w-24 rounded-md animate-pulse"></div>
        </div>
      </header>
      
      {/* Page Content with Skeleton */}
      <main className="w-full max-w-5xl mx-auto p-4 flex-grow">
        {/* Skeleton for Search Bar */}
        <div className="mb-6">
          <div className="bg-muted h-12 w-full rounded-md animate-pulse"></div>
        </div>

        {/* Skeleton for Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-card p-4 rounded-lg shadow-sm border border-border flex flex-col justify-between animate-pulse">
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-full mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="mt-4 flex justify-end">
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 