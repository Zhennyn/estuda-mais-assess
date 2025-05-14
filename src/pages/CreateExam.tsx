
import React from "react";
import { Header } from "@/components/Header";
import { ExamCreator } from "@/components/professor/ExamCreator";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const CreateExam = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Link to="/professor/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Voltar ao Dashboard</span>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Criar Nova Prova</h1>
        
        <div className="bg-white p-8 rounded-lg shadow">
          <ExamCreator />
        </div>
      </div>
    </div>
  );
};

export default CreateExam;
