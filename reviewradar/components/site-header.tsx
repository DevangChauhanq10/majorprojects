"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogIn } from "lucide-react";

export function SiteHeader() {
  const { isSignedIn, user } = useUser();
  const role = user?.publicMetadata?.role as string | undefined;

  let dashboardLink = "/dashboard/user";
  if (role === "admin") dashboardLink = "/dashboard/admin";
  else if (role === "analyst") dashboardLink = "/dashboard/analyst";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#222] bg-[#0a0a0a]">
      <div className="container flex h-16 items-center px-4 md:px-8">
        <Link href="/" className="mr-8 flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center">
             <div className="h-3 w-3 rounded-full bg-white"></div>
          </div>
          <span className="font-bold tracking-tight text-white text-lg">
            ReviewRadar
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-between md:justify-end">
          <nav className="flex items-center gap-4">
             {/* Navigation buttons removed as per user request - using Demo Cards instead */}
          </nav>
        </div>
      </div>
    </header>
  );
}
