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
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const loadUserProfile = async (supabaseUser: SupabaseUser, currentSession: Session) => {
    try {
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
        if (currentSession) {
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
      setSession(currentSession);
    } catch (error) {
      console.error("Unexpected error loading user profile:", error);
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    let mounted = true;
    
    // First, check the current session once on mount
    const initialSessionCheck = async () => {
      try {
        setIsLoading(true);
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        // Only process if component is still mounted
        if (!mounted) return;
        
        if (currentSession?.user) {
          await loadUserProfile(currentSession.user, currentSession);
        } else {
          setUser(null);
          setSession(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking initial session:", error);
        setUser(null);
        setSession(null);
        setIsLoading(false);
      } finally {
        if (mounted) {
          setAuthChecked(true);
        }
      }
    };

    initialSessionCheck();

    // Then setup the auth listener for subsequent changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log(`Auth event: ${event}`, newSession);
        
        if (!mounted) return;
        
        setIsLoading(true);
        
        if (newSession?.user) {
          await loadUserProfile(newSession.user, newSession);
        } else {
          setUser(null);
          setSession(null);
          setIsLoading(false);
        }
      }
    );

    // Clean up both effects when unmounting
    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const login = async () => {
    // ... keep existing code (login placeholder function) ...
    console.warn("UserContext.login is a placeholder and should be triggered by actual Supabase auth calls in UI components.");
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error logging out:", error.message);
      }
      // onAuthStateChange will handle setting user and session to null
    } catch (error) {
      console.error("Unexpected error during logout:", error);
      // As a fallback, manually clear state
      setUser(null);
      setSession(null);
    } finally {
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
