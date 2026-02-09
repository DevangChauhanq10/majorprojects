'use client';

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Download } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { exportFeedbackToCSV } from "@/app/actions/analyst";
import { toast } from "sonner";
import { FeedbackFilter } from "@/app/actions/analyst";

export function FeedbackFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    replace(`${pathname}?${params.toString()}`);
  };

  const handleExport = async () => {
    try {
      const filters: FeedbackFilter = {
        search: searchParams.get('search') || undefined,
        category: (searchParams.get('category') as any) || undefined,
        rating: searchParams.get('rating') || undefined,
        sentiment: searchParams.get('sentiment') || undefined,
        dateRange: searchParams.get('dateRange') || undefined,
      };

      const csvData = await exportFeedbackToCSV(filters);
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feedback-export-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Export successful!");
    } catch (error) {
        console.error(error);
      toast.error("Failed to export.");
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search feedback..."
            className="pl-8"
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get('search')?.toString()}
          />
        </div>

        {/* Category Filter */}
        <Select 
          onValueChange={(val) => handleFilterChange('category', val)}
          defaultValue={searchParams.get('category') || "All"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            <SelectItem value="Bug">Bug</SelectItem>
            <SelectItem value="Feature">Feature</SelectItem>
            <SelectItem value="UX">UX</SelectItem>
            <SelectItem value="Performance">Performance</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>

        {/* Rating Filter */}
        <Select 
          onValueChange={(val) => handleFilterChange('rating', val)}
          defaultValue={searchParams.get('rating') || "All"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>

        {/* Sentiment Filter */}
        <Select 
          onValueChange={(val) => handleFilterChange('sentiment', val)}
          defaultValue={searchParams.get('sentiment') || "All"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sentiment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Sentiments</SelectItem>
            <SelectItem value="Positive">Positive</SelectItem>
            <SelectItem value="Neutral">Neutral</SelectItem>
            <SelectItem value="Negative">Negative</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range Filter */}
        <Select 
          onValueChange={(val) => handleFilterChange('dateRange', val)}
          defaultValue={searchParams.get('dateRange') || "All"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Time</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
        </Button>
      </div>
    </div>
  );
}
