"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export function RoleButton() {
  const router = useRouter();
  const { user } = useUser();

  const handleSetRole = async (role: "admin" | "analyst") => {
    try {
      const res = await fetch("/api/setup-role", { 
        method: "POST",
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (res.ok) {
        if (user) await user.reload();
        toast.success(`Role updated to '${role}'!`);
        router.refresh();
      } else {
        toast.error(data.error || "Failed to update role");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={() => handleSetRole("analyst")} variant="secondary" className="bg-yellow-200 hover:bg-yellow-300 text-yellow-900 border-yellow-400">
        <UserPlus className="mr-2 h-4 w-4" />
        Set Analyst
      </Button>
      <Button onClick={() => handleSetRole("admin")} variant="secondary" className="bg-rose-200 hover:bg-rose-300 text-rose-900 border-rose-400">
        <UserPlus className="mr-2 h-4 w-4" />
        Set Admin
      </Button>
    </div>
  );
}
