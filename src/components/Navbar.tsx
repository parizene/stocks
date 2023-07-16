"use client";

import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";

export default function Navbar() {
  const supabase = createClientComponentClient();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => {
        subscription.unsubscribe();
      };
    })();
  }, [supabase]);

  return (
    <nav className="sticky top-0 flex justify-between border-b border-border bg-background p-4">
      <div>
        <Button variant="link">
          <Link href="/" className="text-base">
            Home
          </Link>
        </Button>
        {session && (
          <Button variant="link">
            <Link href="/portfolios" className="text-base">
              Portfolios
            </Link>
          </Button>
        )}
      </div>

      <div className="flex items-center">
        {session ? (
          <div>
            <form action="/auth/signout" method="post">
              <Button variant="ghost" type="submit" className="mr-4">
                Sign out
              </Button>
            </form>
          </div>
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
