"use client";

import LoginCard from "@/components/LoginCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const handleSignUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (!error) {
      if (data.session) {
        return router.push("/portfolios");
      } else {
        setEmail(data.user?.email || null);
        setShowAlert(true);
        return;
      }
    }
    throw error;
  };

  return showAlert ? (
    <div className="flex justify-center mt-8">
      <Alert className="w-[350px]">
        <Mail className="h-4 w-4" />
        {email && <AlertTitle>{email}</AlertTitle>}
        <AlertDescription>
          In order to start using your account, you need to confirm your email
          address
        </AlertDescription>
      </Alert>
    </div>
  ) : (
    <LoginCard
      title="Sign up"
      submitButtonText="Sign up"
      onSubmit={handleSignUp}
    />
  );
}
