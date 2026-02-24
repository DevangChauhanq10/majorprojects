"use client";

import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { User, LogIn, ChevronRight, HelpCircle } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function SiteHeader() {
  const { isSignedIn, user, isLoaded } = useUser();
  const role = user?.publicMetadata?.role as string | undefined;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#222] bg-[#0a0a0a]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center">
             <div className="h-3 w-3 rounded-full bg-white"></div>
          </div>
          <span className="font-bold tracking-tight text-white text-lg">
            ReviewRadar
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
           {isLoaded && isSignedIn && (
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
           )}
           {isLoaded && !isSignedIn && (
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <button className="flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] transition-all">
                   <Avatar className="w-8 h-8 ring-2 ring-transparent hover:ring-white/30 transition-all">
                     <AvatarFallback className="bg-[#1a1a1a] border border-[#333] text-gray-400">
                       <User className="h-4 w-4" />
                     </AvatarFallback>
                   </Avatar>
                 </button>
               </DropdownMenuTrigger>
               <DropdownMenuContent 
                 className="w-[280px] p-0 font-sans border border-[#333] bg-[#0c0c0c] shadow-[0_16px_32px_rgba(0,0,0,0.8)] rounded-[0.75rem] overflow-hidden !mt-2 z-50 origin-top-right transform-gpu will-change-transform data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2" 
                 align="end" 
                 forceMount
               >
                 <div className="px-5 py-4 pb-3 flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-[#333] shadow-sm">
                      <AvatarFallback className="bg-[#1a1a1a] text-gray-400">
                        <User className="h-[18px] w-[18px]" strokeWidth={2.5} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1 overflow-hidden space-y-0.5">
                      <p className="text-[14px] font-semibold text-white leading-tight truncate">Guest Account</p>
                      <p className="text-[13px] text-[#A0A0A0] leading-tight truncate">Not Signed In</p>
                    </div>
                 </div>
                 
                 <div className="h-px bg-[#2a2a2a] w-[calc(100%-24px)] mx-auto my-1" />
                 
                 <div className="p-2 space-y-0.5">
                   <DropdownMenuItem asChild className="group cursor-pointer rounded-md px-3 py-2 text-[#EAEAEA] hover:!bg-[#222] hover:text-white transition-colors focus:bg-[#222] focus:text-white data-[highlighted]:bg-[#222]">
                     <button 
                       className="w-full flex items-center justify-between outline-none"
                       onClick={() => document.getElementById("demo-roles")?.scrollIntoView({ behavior: "smooth" })}
                     >
                       <div className="flex items-center">
                         <LogIn className="mr-3 h-[18px] w-[18px] text-[#A0A0A0] group-hover:text-white transition-colors" />
                         <span className="text-[14px] font-medium font-sans">Sign in</span>
                       </div>
                       <ChevronRight className="h-4 w-4 opacity-50 text-[#A0A0A0]" />
                     </button>
                   </DropdownMenuItem>
                   <DropdownMenuItem asChild className="group cursor-pointer rounded-md px-3 py-2 text-[#EAEAEA] hover:!bg-[#222] hover:text-white transition-colors focus:bg-[#222] focus:text-white data-[highlighted]:bg-[#222]">
                      <Link href="https://github.com/DevangChauhanq10/majorprojects" target="_blank" className="w-full flex items-center justify-between outline-none">
                        <div className="flex items-center">
                          <HelpCircle className="mr-3 h-[18px] w-[18px] text-[#A0A0A0] group-hover:text-white transition-colors" />
                          <span className="text-[14px] font-medium font-sans">Source Code</span>
                        </div>
                        <ChevronRight className="h-4 w-4 opacity-50 text-[#A0A0A0]" />
                      </Link>
                   </DropdownMenuItem>
                 </div>
                 
                 <div className="h-px bg-[#2a2a2a] w-[calc(100%-24px)] mx-auto mt-1 mb-2" />
                 
                 <div className="px-5 pb-3 pt-1 flex justify-between items-center text-[12px] text-[#808080] font-medium">
                   <span>Powered by ReviewRadar</span>
                   <div className="flex items-center gap-1">
                     <div className="w-[14px] h-[14px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                     </div>
                   </div>
                 </div>
               </DropdownMenuContent>
             </DropdownMenu>
           )}
        </div>
      </div>
    </header>
  );
}
