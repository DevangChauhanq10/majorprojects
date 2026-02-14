'use client';

import { Button } from "@/components/ui/button";
import { sendWeeklyDigest } from "@/app/actions/email";
import { toast } from "sonner";
import { useState } from "react";
import { Mail } from "lucide-react";

interface SendDigestButtonProps {
  stats: {
    total: number;
    topCategory: string;
    avgRating: string;
  };
  email: string; // user email to send to
}

export function SendDigestButton({ stats, email }: SendDigestButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      const result = await sendWeeklyDigest(email, stats);
      if (result.success) {
        toast.success("Weekly digest sent!");
      } else {
        toast.error("Failed to send digest.");
      }
    } catch (error) {
      toast.error("An error occurred.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSend} disabled={loading} variant="outline" size="sm">
      <Mail className="mr-2 h-4 w-4" />
      {loading ? "Sending..." : "Send Digest"}
    </Button>
  );
}
