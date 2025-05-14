
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import { v4 as uuidv4 } from "uuid";
import { User } from "@/types";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useUser();
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login logic - in a real app, you would validate against a backend
    if (loginData.email && loginData.password) {
      const user: User = {
        id: uuidv4(),
        name: loginData.email.split('@')[0], // Just for demo purposes
        email: loginData.email,
        role: loginData.email.includes("professor") ? "professor" : "student"
      };
      
      login(user);
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${user.name}!`
      });
      
      navigate(user.role === "professor" ? "/professor/dashboard" : "/student/dashboard");
    } else {
      toast({
        title: "Erro ao fazer login",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock register logic
    if (registerData.name && registerData.email && registerData.password) {
      const user: User = {
        id: uuidv4(),
        name: registerData.name,
        email: registerData.email,
        role: registerData.role
      };
      
      login(user);
      toast({
        title: "Cadastro realizado com sucesso!",
        description: `Bem-vindo, ${user.name}!`
      });
      
      navigate(user.role === "professor" ? "/professor/dashboard" : "/student/dashboard");
    } else {
      toast({
        title: "Erro ao fazer cadastro",
        description: "Por favor, preencha todos os campos.",
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
          <Tabs defaultValue="login" value={tab} onValueChange={(value) => setTab(value as "login" | "register")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">Entrar</Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input 
                      id="name" 
                      placeholder="Seu nome completo" 
                      value={registerData.name}
                      onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tipo de Usuário</Label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          name="role" 
                          checked={registerData.role === "student"} 
                          onChange={() => setRegisterData({...registerData, role: "student"})} 
                        />
                        <span>Aluno</span>
                      </label>
                      
                      <label className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          name="role" 
                          checked={registerData.role === "professor"} 
                          onChange={() => setRegisterData({...registerData, role: "professor"})} 
                        />
                        <span>Professor</span>
                      </label>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">Cadastrar</Button>
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
