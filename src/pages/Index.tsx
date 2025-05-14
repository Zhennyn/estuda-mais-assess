
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Estuda+</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8">
              Plataforma digital para criação, aplicação e correção de provas escolares
            </p>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-white border-white hover:bg-white hover:text-primary"
              onClick={() => navigate("/login")}
            >
              Começar Agora
            </Button>
          </div>
        </section>
        
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Benefícios</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl">
                ⏱️
              </div>
              <h3 className="text-xl font-semibold mb-2">Eficiência</h3>
              <p className="text-gray-600">Automatização do processo de avaliação, economizando tempo e recursos</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl">
                ✅
              </div>
              <h3 className="text-xl font-semibold mb-2">Precisão</h3>
              <p className="text-gray-600">Redução de falhas humanas no processo de correção das provas</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl">
                📊
              </div>
              <h3 className="text-xl font-semibold mb-2">Análises</h3>
              <p className="text-gray-600">Relatórios automáticos para acompanhamento pedagógico eficiente</p>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
            
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="md:w-1/3 flex-shrink-0 bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center mx-auto">
                    1
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold mb-2">Criação Digital</h3>
                  <p className="text-gray-700">Professores criam provas em um editor intuitivo com diversas opções de questões</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="md:w-1/3 flex-shrink-0 bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center mx-auto">
                    2
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold mb-2">Aplicação</h3>
                  <p className="text-gray-700">Alunos realizam as provas em dispositivos móveis ou computadores</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="md:w-1/3 flex-shrink-0 bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center mx-auto">
                    3
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold mb-2">Correção Automática</h3>
                  <p className="text-gray-700">O sistema corrige automaticamente as respostas e gera relatórios detalhados</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Comece a usar o Estuda+ hoje mesmo</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Otimize seu processo educacional e reduza a carga administrativa
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/login")}
          >
            Criar Conta Gratuita
          </Button>
        </section>
      </main>
      
      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Estuda+ - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
