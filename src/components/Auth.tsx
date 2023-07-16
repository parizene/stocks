"use client";

import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useToast } from "./ui/use-toast";

type AuthContextType = {
  session: Session | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getSession();
      setSession(data.session);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${location.origin}/api/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    if (res.ok) {
      const { data, error } = await supabase.auth.getSession();
      setSession(data.session);
      return true;
    } else {
      const json = await res.json();
      toast({
        title: "Error",
        description: json.message,
      });
      return false;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${location.origin}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    if (res.ok) {
      const { data, error } = await supabase.auth.getSession();
      setSession(data.session);
      return true;
    } else {
      const json = await res.json();
      toast({
        title: "Error",
        description: json.message,
      });
      return false;
    }
  }, []);

  const signOut = useCallback(async () => {
    const res = await fetch(`${location.origin}/api/auth/signout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const { data, error } = await supabase.auth.getSession();
      setSession(data.session);
      return true;
    } else {
      const json = await res.json();
      toast({
        title: "Error",
        description: json.message,
      });
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
