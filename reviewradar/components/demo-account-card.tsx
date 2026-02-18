import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser, useClerk } from "@clerk/nextjs";
import { Check, Copy, ExternalLink, Shield, BarChart2, User, KeyRound, Mail } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface DemoAccountCardProps {
  role: "user" | "analyst" | "admin";
  email: string;
  pass: string;
  features: string[];
  icon?: React.ReactNode;
  highlighted?: boolean;
}

const roleConfig = {
  user: {
    icon: <User className="h-8 w-8" />,
    title: "User (Customer)",
    description: "Submit feedback, track status, and view public roadmap.",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    btnColor: "bg-blue-600 hover:bg-blue-700",
  },
  analyst: {
    icon: <BarChart2 className="h-8 w-8" />,
    title: "Analyst (Product Team)",
    description: "View dashboard, analyze feedback trends, and generate AI insights.",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    btnColor: "bg-purple-600 hover:bg-purple-700",
  },
  admin: {
    icon: <Shield className="h-8 w-8" />,
    title: "Admin (System Manager)",
    description: "Manage users, moderate content, and configure system settings.",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    btnColor: "bg-orange-600 hover:bg-orange-700",
  }
};

export function DemoAccountCard({ role, email, pass, features, highlighted }: DemoAccountCardProps) {
  const { user, isLoaded } = useUser();
  const clerk = useClerk();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const config = roleConfig[role];

  // Auto-assign role if logged in with demo account
  useEffect(() => {
    if (!isLoaded || !user) return;
    
    // Check if current user email matches this card's email
    const userEmail = user.primaryEmailAddress?.emailAddress;
    if (userEmail === email) {
      const currentRole = user.publicMetadata?.role;
      
      // If role mismatch (e.g., analyst logged in but has 'user' role), fix it
      if (currentRole !== role && role !== 'user') {
        const syncRole = async () => {
          try {
            await fetch("/api/setup-role", { 
                method: "POST",
                body: JSON.stringify({ role }),
            });
            await user.reload();
            toast.success(`Role synced to ${role}! Redirecting...`);
            router.refresh(); // Refresh to update middleware state
          } catch (error) {
            console.error("Failed to sync role", error);
          }
        };
        syncRole();
      }
    }
  }, [isLoaded, user, email, role, router]);

  const handleCopy = () => {
    navigator.clipboard.writeText(email); // For simplicity, just copying email first as password is standard
    toast.success("Email copied to clipboard!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPass = () => {
    navigator.clipboard.writeText(pass);
    toast.success("Password copied to clipboard!");
  }

  const roleRaw = user?.publicMetadata?.role as string | undefined;
  const currentRole = roleRaw || "user"; // Default to user if no role set
  
  // Access Logic:
  // - Admin can access everything
  // - Analyst can access Analyst & User
  // - User can only access User
  const hasAccess = 
    currentRole === "admin" || 
    (currentRole === "analyst" && role !== "admin") ||
    (currentRole === "user" && role === "user");

  return (
    <div className={cn(
      "relative flex flex-col justify-between rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg bg-background",
      highlighted ? "border-primary ring-1 ring-primary/20 shadow-md scale-105 z-10" : "border-border"
    )}>
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
          Try AI Features
        </div>
      )}

      <div>
        <div className={cn("mb-4 inline-flex items-center justify-center rounded-lg p-3", config.color)}>
          {config.icon}
        </div>

        <h3 className="text-xl font-bold">{config.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {config.description}
        </p>

        <ul className="mt-6 space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center text-sm text-foreground/80">
              <Check className="mr-2 h-4 w-4 text-green-500 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 space-y-4">
        <div className="rounded-lg bg-muted/50 p-3 space-y-2 text-xs font-mono border border-border/50">
          <div className="flex items-center justify-between group cursor-pointer" onClick={handleCopy}>
             <div className="flex items-center gap-2 overflow-hidden">
                <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="truncate">{email}</span>
             </div>
             <Copy className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-center justify-between group cursor-pointer" onClick={handleCopyPass}>
             <div className="flex items-center gap-2">
                <KeyRound className="h-3 w-3 text-muted-foreground shrink-0" />
                <span>{pass}</span>
             </div>
             <Copy className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="grid gap-2">
             <Button 
                onClick={handleCopy} 
                variant="outline"
                className="w-full justify-between group"
            >
                <span className="flex items-center gap-2">
                    <Copy className="h-4 w-4 text-muted-foreground" />
                    Copy Email
                </span>
                {copied && <span className="text-xs text-green-600 font-medium animate-in fade-in">Copied!</span>}
            </Button>
            
            {!user ? (
              <SignInButton mode="modal" forceRedirectUrl={`/dashboard/${role}`}>
                  <Button className={cn("w-full transition-colors", config.btnColor)}>
                      Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
                      <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
              </SignInButton>
            ) : !hasAccess ? (
               <Button 
                  className={cn("w-full transition-colors", config.btnColor)} 
                  onClick={() => {
                     navigator.clipboard.writeText(email);
                     toast.success("Email copied! redirected to sign-in...", { duration: 3000 });
                     // Sign out and redirect to login
                     setTimeout(() => {
                        clerk.signOut({ redirectUrl: '/' });
                     }, 1000);
                  }}
                >
                  Switch Account to Access
                  <ExternalLink className="ml-2 h-4 w-4" />
               </Button>
            ) : (
              <Button asChild className={cn("w-full transition-colors", config.btnColor)}>
                  <Link href={`/dashboard/${role}`}>
                      Go to {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
                      <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}
