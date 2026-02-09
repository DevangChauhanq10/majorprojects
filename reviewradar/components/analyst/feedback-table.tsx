'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Feedback } from "@prisma/client";
import { Star } from "lucide-react";

interface FeedbackTableProps {
  feedback: Feedback[];
}

export function FeedbackTable({ feedback }: FeedbackTableProps) {
  
  const getReviewStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
        }`}
      />
    ));
  };


  if (feedback.length === 0) {
    return (
      <div className="text-center py-10 bg-muted/20 rounded-lg border border-dashed">
        <p className="text-muted-foreground">No feedback found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Sentiment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedback.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium max-w-[200px] truncate" title={item.title}>
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{item.description}</div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{item.category}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex">{getReviewStars(item.rating)}</div>
              </TableCell>
              <TableCell className="font-mono text-xs">{item.userId.slice(0, 15)}...</TableCell>
              <TableCell className="whitespace-nowrap">
                {new Date(item.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                 <Badge variant={item.sentiment === 'Positive' ? 'default' : item.sentiment === 'Negative' ? 'destructive' : 'outline'}>
                    {item.sentiment || 'N/A'}
                 </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
