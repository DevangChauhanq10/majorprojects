import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { RoleButton } from "@/components/role-button";
import { SiteHeader } from "@/components/site-header";
import { ArrowRight, MessageSquarePlus, Activity } from "lucide-react";

export default async function Home() {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  
  // Debug: fetch directly from Clerk to see if session is stale
  let dbRole = null;
  if (userId) {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    dbRole = user.publicMetadata.role;
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Shape the Future of Our Product
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Your voice matters. Share your ideas, report bugs, and track their progress in real-time. 
              Help us build what you need.
            </p>
            <div className="space-x-4">
              <Link href="/submit-feedback">
                <Button size="lg" className="h-11 px-8 rounded-full">
                  Submit Feedback
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href={userId ? "/dashboard/user" : "/sign-in"}>
                <Button variant="outline" size="lg" className="h-11 px-8 rounded-full">
                  Track My Requests
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-2">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <MessageSquarePlus className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Easy Submission</h3>
                  <p className="text-sm text-muted-foreground">
                    Quickly submit features, bugs, or general feedback with our streamlined form.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Activity className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Real-time Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    See the status of your feedback as it moves from review to development.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {userId && (
           <section className="container py-8 max-w-lg mx-auto">
             <div className="p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-900 rounded-lg">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-500 mb-2 flex items-center gap-2">
                  <span>🚧 Developer Tools</span>
                </h3>
                <div className="text-xs text-muted-foreground space-y-1 mb-3">
                  <p>User ID: {userId.slice(0, 8)}...</p>
                  <p>Token Role: {role || 'None'}</p>
                  <p>DB Role: {String(dbRole) || 'None'}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium">Switch Role:</p>
                    <RoleButton />
                </div>
             </div>
           </section>
        )}
      </main>
    </div>
  );
}
