import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { RoleButton } from "@/components/role-button";

export default async function Home() {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4 text-center">
      <div className="space-y-6 max-w-lg">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          ReviewRadar
        </h1>
        <p className="text-xl text-muted-foreground">
          Your central hub for gathering and analyzing user feedback.
          Your central hub for gathering and analyzing user feedback.
        </p>
        
        {userId && (
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-md text-sm">
                <p><strong>Debug Info:</strong></p>
                <p>User ID: {userId.slice(0, 8)}...</p>
                <p>Current Role: <strong>{role || 'None'}</strong></p>
                {!role && (
                  <div className="mt-2">
                    <p className="mb-2 text-xs">You need 'analyst' role to access the dashboard.</p>
                    <RoleButton />
                  </div>
                )}
            </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href="/submit-feedback">
            <Button size="lg" className="w-full sm:w-auto">
              Submit Feedback
            </Button>
          </Link>
          
          <Link href="/dashboard/analyst">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Analyst Dashboard
            </Button>
          </Link>
        </div>
        
        <div className="pt-8 text-sm text-muted-foreground">
          <p>
            ReviewRadar helps you track bugs, feature requests, and user sentiment in real-time.
          </p>
        </div>
      </div>
    </div>
  );
}
