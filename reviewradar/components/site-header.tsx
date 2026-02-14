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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">
            ReviewRadar
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            {isSignedIn ? (
              <Button asChild variant="ghost" size="sm">
                <Link href={dashboardLink}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link href="/sign-in">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
