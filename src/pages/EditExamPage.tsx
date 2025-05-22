
import React from "react";
import { Header } from "@/components/Header";
import { ExamEditor } from "@/components/professor/ExamEditor";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useExam } from "@/context/ExamContext";
import { toast } from "@/hooks/use-toast";

const EditExamPage = () => {
  const { examId } = useParams<{ examId: string }>();
  const { getExamById } = useExam();
  const navigate = useNavigate();

  if (!examId) {
    // Este caso não deve acontecer se a rota estiver configurada corretamente
    toast({ title: "Erro", description: "ID da prova não fornecido.", variant: "destructive" });
    navigate("/professor/dashboard");
    return null; 
  }

  const exam = getExamById(examId);

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto py-8 text-center">
          <p className="text-xl">Prova não encontrada para edição.</p>
          <Link to="/professor/dashboard">
            <Button variant="outline" className="mt-4">Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Link to={`/professor/exam/${examId}`} className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Voltar para Detalhes da Prova</span>
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-8">Editar Prova: {exam.title}</h1>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <ExamEditor examId={examId} />
        </div>
      </div>
    </div>
  );
};

export default EditExamPage;
