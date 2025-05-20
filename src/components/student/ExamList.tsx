import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useExam } from "@/context/ExamContext";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, XCircle } from "lucide-react"; // Icons for status

const PASSING_SCORE = 60; // Define passing score threshold

export const StudentExamList = () => {
  const { user } = useUser();
  const { getExamsForStudent, getSubmissionsByStudentId } = useExam();
  
  if (!user) return null;
  
  const exams = getExamsForStudent();
  const submissions = getSubmissionsByStudentId(user.id);
  
  const submittedExamIds = submissions.map(s => s.exam_id);
  const availableExams = exams.filter(exam => !submittedExamIds.includes(exam.id));
  
  if (exams.length === 0 && availableExams.length === 0 && submissions.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-medium text-gray-600">Nenhuma prova disponível no momento.</h3>
        <p className="mt-2 text-gray-500">As provas criadas pelos professores aparecerão aqui.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {availableExams.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Provas Disponíveis</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            {availableExams.map(exam => (
              <div key={exam.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold">{exam.title}</h3>
                
                {exam.description && (
                  <p className="text-gray-600 mt-1 text-sm">{exam.description}</p>
                )}
                
                <div className="mt-3 text-sm text-gray-500">
                  <div>Duração: {exam.duration} minutos</div>
                  <div>Questões: {exam.questions.length}</div>
                  <div>Criado: {formatDistanceToNow(new Date(exam.created_at), { 
                    addSuffix: true,
                    locale: ptBR 
                  })}</div>
                </div>
                
                <div className="mt-4">
                  <Link to={`/student/exam/${exam.id}`}>
                    <Button className="w-full">Fazer Prova</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {submissions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Provas Concluídas</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            {submissions.map(submission => {
              const exam = exams.find(e => e.id === submission.exam_id);
              if (!exam) return null;
              
              const score = submission.score || 0;
              const isApproved = score >= PASSING_SCORE;
              
              return (
                <div key={submission.id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                  <h3 className="text-lg font-semibold">{exam.title}</h3>
                  
                  <div className="mt-3 text-sm text-gray-500 space-y-1">
                    <div>Concluído: {formatDistanceToNow(new Date(submission.submitted_at), { 
                      addSuffix: true,
                      locale: ptBR 
                    })}</div>
                    <div className="font-medium">Nota: <span className={isApproved ? "text-green-600" : "text-red-600"}>{score.toFixed(1)}%</span></div>
                     <div className={`flex items-center text-sm font-semibold ${isApproved ? "text-green-600" : "text-red-600"}`}>
                      {isApproved ? <CheckCircle2 size={16} className="mr-1" /> : <XCircle size={16} className="mr-1" />}
                      {isApproved ? "Aprovado" : "Reprovado"}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Link to={`/student/result/${submission.id}`}>
                      <Button variant="outline" className="w-full">Ver Resultado</Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {availableExams.length === 0 && submissions.length === 0 && exams.length > 0 && (
         <div className="text-center py-8">
            <h3 className="text-xl font-medium text-gray-600">Você já concluiu todas as provas disponíveis.</h3>
            <p className="mt-2 text-gray-500">Aguarde novas provas serem liberadas.</p>
        </div>
      )}
    </div>
  );
};
