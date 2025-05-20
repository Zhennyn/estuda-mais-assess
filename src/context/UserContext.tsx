import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";

type UserContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (userCredentials: any, isRegister?: boolean, registerData?: any) => Promise<void>;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start true

  const loadUserProfile = async (supabaseUser: SupabaseUser, currentSession: Session) => {
    // 1. Buscar perfil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (profileError || !profile) {
      console.error("Error fetching profile or profile not found:", profileError?.message);
      setUser(null);
      setSession(null);
      // Avoid calling signOut if the auth event was already SIGNED_OUT or USER_DELETED
      // This helps prevent potential loops if signOut itself is problematic.
      if (currentSession) { // Only attempt signOut if there was a session context.
         await supabase.auth.signOut();
      }
      return;
    }

    // 2. Buscar papel do usuário
    const { data: userRoleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', supabaseUser.id)
      .single();

    if (roleError || !userRoleData) {
      console.error("Error fetching user role or role not found:", roleError?.message);
      setUser(null);
      setSession(null);
      if (currentSession) {
        await supabase.auth.signOut();
      }
      return;
    }
    
    const fullUser: User = {
      ...profile,
      role: userRoleData.role as UserRole,
    };
    setUser(fullUser);
    setSession(currentSession); // Keep session in sync
  };
  
  useEffect(() => {
    setIsLoading(true); // Ensure loading is true when effect starts

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log(`Auth event: ${event}`, newSession);
        setIsLoading(true); // Set loading true when auth state is being processed
        setSession(newSession);
        if (newSession?.user) {
          await loadUserProfile(newSession.user, newSession);
        } else {
          setUser(null); // User is null if session is null (e.g., after logout)
        }
        setIsLoading(false); // Done processing this auth change
      }
    );

    // Clean up listener on unmount
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []); // Empty dependency array ensures this runs once on mount

  const login = async () => {
    // ... keep existing code (login placeholder function) ...
    console.warn("UserContext.login is a placeholder and should be triggered by actual Supabase auth calls in UI components.");
  };

  const logout = async () => {
    // supabase.auth.signOut() will trigger onAuthStateChange
    // onAuthStateChange will then handle setting user, session to null and isLoading to false.
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
      // As a fallback, if signOut fails, manually clear state and set loading false
      setUser(null);
      setSession(null);
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, session, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
