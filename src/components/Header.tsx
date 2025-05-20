
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";

export const Header = () => {
  const { user, logout } = useUser();

  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Estuda+</Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm">
                Olá, {user.name} ({user.role === "professor" ? "Professor" : "Aluno"})
              </span>
              <Button 
                variant="outline" 
                className="bg-transparent text-white border-white hover:bg-white hover:text-primary focus:ring-white" 
                onClick={logout}
              >
                Sair
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button 
                variant="outline" 
                className="bg-transparent text-white border-white hover:bg-white hover:text-primary focus:ring-white"
              >
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

