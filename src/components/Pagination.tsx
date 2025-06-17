'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2; // Show 2 pages before and after current page
    const range = [];
    const rangeWithDots = [];

    // Calculate range of pages to show
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // Add first page
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    // Add middle pages
    rangeWithDots.push(...range);

    // Add last page
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center space-x-1 mt-8">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2.5 text-sm font-medium text-muted-foreground bg-background border border-border rounded-xl hover:bg-muted hover:text-primary hover:border-primary/70 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-background disabled:hover:text-muted-foreground transition-all duration-200"
      >
        Previous
      </button>

      {/* Page numbers */}
      <div className="hidden sm:flex space-x-1">
        {visiblePages.map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-sm font-medium text-muted-foreground">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  currentPage === page
                    ? 'bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:opacity-90'
                    : 'text-foreground bg-background border border-border hover:bg-muted hover:text-primary hover:border-primary/70 shadow-sm hover:shadow-md'
                }`}
              >
                {page}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Mobile page indicator */}
      <div className="sm:hidden px-4 py-2.5 text-sm font-medium text-foreground bg-background border border-border rounded-xl shadow-sm">
        {currentPage} of {totalPages}
      </div>

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2.5 text-sm font-medium text-muted-foreground bg-background border border-border rounded-xl hover:bg-muted hover:text-primary hover:border-primary/70 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-background disabled:hover:text-muted-foreground transition-all duration-200"
      >
        Next
      </button>
    </div>
  );
} 