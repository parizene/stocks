"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./Auth";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";

export default function Navbar() {
  const router = useRouter();
  const auth = useAuth();

  const handleSignOut = async () => {
    if (!auth) return;

    if (await auth.signOut()) {
      router.push("/");
    }
  };

  return (
    <nav className="sticky top-0 flex justify-between border-b border-border bg-background p-4">
      <div>
        <Button variant="link">
          <Link href="/" className="text-base">
            Home
          </Link>
        </Button>
        {auth?.session && (
          <Button variant="link">
            <Link href="/portfolios" className="text-base">
              Portfolios
            </Link>
          </Button>
        )}
      </div>

      <div className="flex items-center">
        {auth?.session ? (
          <Button variant="ghost" onClick={handleSignOut} className="mr-4">
            Sign out
          </Button>
        ) : (
          <Button variant="ghost" className="mr-4">
            <Link href="/login">Sign in</Link>
          </Button>
        )}
        <ModeToggle />
      </div>
    </nav>
  );
}
