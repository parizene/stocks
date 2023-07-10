"use client";

import LoginCard from "@/components/LoginCard";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) {
      return router.push("/portfolios");
    }
    throw error;
  };

  return (
    <LoginCard
      title="Sign in"
      submitButtonText="Sign in"
      onSubmit={handleSignIn}
    />
  );
}
