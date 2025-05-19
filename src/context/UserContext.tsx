
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";

type UserContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (userCredentials: any, isRegister?: boolean, registerData?: any) => Promise<void>; // Simplificado por enquanto
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserSession = async () => {
      setIsLoading(true);
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Error getting session:", sessionError.message);
        setIsLoading(false);
        return;
      }
      
      setSession(currentSession);
      if (currentSession?.user) {
        await loadUserProfile(currentSession.user, currentSession);
      } else {
        setUser(null); // Garante que user seja null se não houver sessão
      }
      setIsLoading(false);
    };

    fetchUserSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth event:", event, newSession);
        setSession(newSession);
        if (newSession?.user) {
          await loadUserProfile(newSession.user, newSession);
        } else {
          setUser(null);
        }
        setIsLoading(false); // Certifique-se de que isLoading é atualizado
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser, currentSession: Session) => {
    // 1. Buscar perfil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (profileError || !profile) {
      console.error("Error fetching profile or profile not found:", profileError?.message);
      // Se o perfil não for encontrado após o login/signup, pode ser um problema com o trigger handle_new_user
      // ou um atraso na propagação. Por enquanto, deslogamos ou setamos um usuário parcial.
      // Para simplificar, vamos definir o usuário como null e deslogar.
      // Idealmente, você pode querer tentar criar o perfil aqui se ele não existir.
      setUser(null);
      setSession(null);
      await supabase.auth.signOut(); // Força o logout se o perfil não for encontrado
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
      // Similar ao perfil, se o papel não for encontrado, algo está errado.
      setUser(null);
      setSession(null);
      await supabase.auth.signOut();
      return;
    }
    
    const fullUser: User = {
      ...profile, // id, name, email, created_at from profiles table
      role: userRoleData.role as UserRole,
    };
    setUser(fullUser);
    setSession(currentSession); // Atualiza a sessão junto com o usuário
  };
  
  // Esta função `login` é um placeholder e será chamada por `Login.tsx`
  // `Login.tsx` cuidará de supabase.auth.signInWithPassword e signUp
  // Esta função é mais para compatibilidade com a estrutura anterior ou se precisarmos de lógica centralizada
  const login = async () => {
    // A lógica de login real (signInWithPassword, signUp) será movida para Login.tsx
    // e UserContext irá reagir a onAuthStateChange.
    // Esta função pode ser removida ou adaptada se não for mais necessária diretamente.
    console.warn("UserContext.login is a placeholder and should be triggered by actual Supabase auth calls in UI components.");
  };

  const logout = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    }
    // onAuthStateChange vai limpar user e session
    // setUser(null);
    // setSession(null); // Removido pois onAuthStateChange cuidará disso
    setIsLoading(false);
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

