import { z } from "zod";

export const FeedbackFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  rating: z.string().optional(),
  sentiment: z.string().optional(),
  dateRange: z.string().optional(),
});

export type FeedbackFilter = z.infer<typeof FeedbackFilterSchema>;
