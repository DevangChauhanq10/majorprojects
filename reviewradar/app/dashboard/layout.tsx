import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata.role;

  if (!role) {

  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-[#222] bg-[#0a0a0a]">
        <div className="container mx-auto flex h-16 items-center px-4 md:px-8 justify-between">
          <div className="flex items-center gap-8">
             <Link href="/" className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center">
                   <div className="h-3 w-3 rounded-full bg-white"></div>
                </div>
                <span className="font-bold tracking-tight text-white text-lg">ReviewRadar</span>
             </Link>
             
             <nav className="flex items-center gap-6 text-sm font-medium">
               {(role === 'user' || role === 'analyst' || role === 'admin') && (
                 <Link href="/dashboard/user" className="text-gray-400 hover:text-white transition-colors">User</Link>
               )}
               
               {(role === 'analyst' || role === 'admin') && (
                 <Link href="/dashboard/analyst" className="text-gray-400 hover:text-white transition-colors">Analyst</Link>
               )}
 
               {role === 'admin' && (
                 <Link href="/dashboard/admin" className="text-gray-400 hover:text-white transition-colors">Admin</Link>
               )}
             </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#1a1a1a] rounded-full border border-[#333]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                  {role || 'Guest'}
                </span>
            </div>
             <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 ring-2 ring-white/10 hover:ring-white/30 transition-all"
                  }
                }}
             />
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
