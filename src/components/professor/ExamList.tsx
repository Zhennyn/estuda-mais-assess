
import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useExam } from "@/context/ExamContext";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const ExamList = () => {
  const { user } = useUser();
  const { getExamsByProfessorId, getSubmissionsByExamId } = useExam();
  
  if (!user) return null;
  
  const exams = getExamsByProfessorId(user.id);
  
  if (exams.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-medium text-gray-600">Você ainda não criou nenhuma prova.</h3>
        <p className="mt-2 text-gray-500">Clique em "Nova Prova" para começar.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Suas Provas</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        {exams.map(exam => {
          const submissions = getSubmissionsByExamId(exam.id);
          
          return (
            <div key={exam.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold">{exam.title}</h3>
              
              {exam.description && (
                <p className="text-gray-600 mt-1">{exam.description}</p>
              )}
              
              <div className="mt-3 text-sm text-gray-500">
                <div>Duração: {exam.duration} minutos</div>
                <div>Questões: {exam.questions.length}</div>
                <div>Criado: {formatDistanceToNow(new Date(exam.created_at), { 
                  addSuffix: true,
                  locale: ptBR 
                })}</div>
              </div>
              
              <div className="mt-3 flex items-center">
                <div className="text-sm">
                  <span className="font-medium">{submissions.length}</span> respostas
                </div>
                
                <div className="ml-auto">
                  <Link to={`/professor/exam/${exam.id}`}>
                    <Button size="sm" variant="outline">Ver detalhes</Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
