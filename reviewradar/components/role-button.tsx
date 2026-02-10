"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export function RoleButton() {
  const router = useRouter();

  const handleSetRole = async () => {
    try {
      const res = await fetch("/api/setup-role", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success("Role updated to 'analyst'! please reload.");
        router.refresh();
      } else {
        toast.error(data.error || "Failed to update role");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Button onClick={handleSetRole} variant="secondary" className="bg-yellow-200 hover:bg-yellow-300 text-yellow-900 border-yellow-400">
      <UserPlus className="mr-2 h-4 w-4" />
      Set Role to Analyst
    </Button>
  );
}
