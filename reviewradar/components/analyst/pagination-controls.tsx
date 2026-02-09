'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationControlsProps {
  totalPages: number;
}

export function PaginationControls({ totalPages }: PaginationControlsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href={createPageURL(currentPage - 1)} 
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        
        {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            // Simple logic for now: show all pages. For production, limit visible pages.
             if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                    <PaginationItem key={page}>
                    <PaginationLink href={createPageURL(page)} isActive={currentPage === page}>
                        {page}
                    </PaginationLink>
                    </PaginationItem>
                );
              }
              if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                    <PaginationItem key={page}>
                        <PaginationEllipsis />
                    </PaginationItem>
                )
              }
              return null;
        })}

        <PaginationItem>
          <PaginationNext 
            href={createPageURL(currentPage + 1)} 
            aria-disabled={currentPage >= totalPages}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
