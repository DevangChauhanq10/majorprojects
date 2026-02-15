"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

import { DemoAccountCard } from "@/components/demo-account-card";
import { SiteHeader } from "@/components/site-header";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { user } = useUser();
  const userId = user?.id;
  
  // Role check safely on client
  const role = user?.publicMetadata?.role as string | undefined;
  
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 relative">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            
            <div className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium">
               🚀 Technical Showcase
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
              ReviewRadar
              <span className="text-primary block text-2xl sm:text-4xl mt-2 font-normal">
                Full-Stack Customer Intelligence Platform
              </span>
            </h1>
            
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              A robust feedback management system built to demonstrate modern web architecture. 
              Features role-based access control, AI-powered sentiment analysis, and real-time data visualization.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-4 opacity-80">
               {["Next.js 14", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Clerk Auth", "Google Gemini AI"].map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-mono border border-secondary-foreground/20">
                    {tech}
                  </span>
               ))}
            </div>

            <div className="space-x-4 mt-6">
              <Link href="https://github.com/DevangChauhanq10/majorprojects" target="_blank">
                <Button variant="outline" size="lg" className="h-11 px-8 gap-2">
                  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                  View Source
                </Button>
              </Link>
              <Button 
                size="lg" 
                className="h-11 px-8"
                onClick={() => {
                  document.getElementById("page-bottom")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Try Demo roles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Demo Accounts Section */}
        <section id="demo-roles" className="container relative z-10 mt-12 max-w-6xl mx-auto px-4 pb-16">
           <div className="grid md:grid-cols-3 gap-6">
              <DemoAccountCard
                role="user"
                email="demo-user@reviewradar.com"
                pass="Demo123!!"
                features={["Submit feedback", "Track status", "View public roadmap"]}
              />
              <DemoAccountCard
                role="analyst"
                email="demo-analyst@reviewradar.com"
                pass="Demo123!!"
                features={["View all feedback", "AI insights", "Export reports"]}
                highlighted={true}
              />
              <DemoAccountCard
                role="admin"
                email="demo-admin@reviewradar.com"
                pass="Demo123!!"
                features={["Manage users", "Content moderation", "System settings"]}
              />
           </div>
        </section>




        <span id="page-bottom" className="block h-1" />
      </main>
    </div>
  );
}
