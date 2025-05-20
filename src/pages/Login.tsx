
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isLoading, session } = useUser();
  const [tab, setTab] = useState<"login" | "register">("login");
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" as "professor" | "student"
  });

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  useEffect(() => {
    if (!isLoading && user && session) {
      navigate(user.role === "professor" ? "/professor/dashboard" : "/student/dashboard");
    }
  }, [user, isLoading, session, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Erro ao fazer login",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        toast({
          title: "Erro ao fazer login",
          description: error.message || "Verifique suas credenciais.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Login em progresso...",
          description: "Você será redirecionado em breve."
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.name || !registerData.email || !registerData.password) {
      toast({
        title: "Erro ao fazer cadastro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            name: registerData.name,
            role: registerData.role 
          }
        }
      });

      if (error) {
        toast({
          title: "Erro ao fazer cadastro",
          description: error.message || "Não foi possível criar a conta.",
          variant: "destructive"
        });
      } else if (signUpData.user) {
        if (signUpData.user.identities && signUpData.user.identities.length === 0) {
            toast({
                title: "Erro ao fazer cadastro",
                description: "Este e-mail já está em uso. Tente fazer login.",
                variant: "destructive",
            });
        } else {
            toast({
                title: "Cadastro realizado com sucesso!",
                description: "Bem-vindo! Você será redirecionado."
            });
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Erro ao fazer cadastro",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Estuda+</h1>
          <p className="text-gray-600 mt-2">Sua plataforma de avaliações digitais</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <Button 
            variant="ghost" 
            className="mb-4 flex items-center text-gray-600 hover:text-primary"
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Voltar para a Página Inicial
          </Button>
          
          <Tabs defaultValue="login" value={tab} onValueChange={(value) => setTab(value as "login" | "register")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login">Email</Label>
                    <Input 
                      id="email-login" 
                      type="email" 
                      placeholder="seu@email.com" 
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      autoComplete="email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-login">Senha</Label>
                    <div className="relative">
                      <Input 
                        id="password-login" 
                        type={showLoginPassword ? "text" : "password"} 
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                      >
                        {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name-register">Nome</Label>
                    <Input 
                      id="name-register" 
                      placeholder="Seu nome completo" 
                      value={registerData.name}
                      onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                      autoComplete="name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-register">Email</Label>
                    <Input 
                      id="email-register" 
                      type="email" 
                      placeholder="seu@email.com" 
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      autoComplete="email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-register">Senha</Label>
                    <div className="relative">
                      <Input 
                        id="password-register" 
                        type={showRegisterPassword ? "text" : "password"} 
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      >
                        {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tipo de Usuário</Label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="role" 
                          value="student"
                          checked={registerData.role === "student"} 
                          onChange={() => setRegisterData({...registerData, role: "student"})} 
                          className="form-radio"
                        />
                        <span>Aluno</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="role" 
                          value="professor"
                          checked={registerData.role === "professor"} 
                          onChange={() => setRegisterData({...registerData, role: "professor"})} 
                          className="form-radio"
                        />
                        <span>Professor</span>
                      </label>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
