
import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useExam } from "@/context/ExamContext";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const StudentExamList = () => {
  const { user } = useUser();
  const { getExamsForStudent, getSubmissionsByStudentId } = useExam();
  
  if (!user) return null;
  
  const exams = getExamsForStudent();
  const submissions = getSubmissionsByStudentId(user.id);
  
  // Filter out exams that have already been submitted
  const submittedExamIds = submissions.map(s => s.examId);
  const availableExams = exams.filter(exam => !submittedExamIds.includes(exam.id));
  
  if (exams.length === 0) {
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
                  <p className="text-gray-600 mt-1">{exam.description}</p>
                )}
                
                <div className="mt-3 text-sm text-gray-500">
                  <div>Duração: {exam.duration} minutos</div>
                  <div>Questões: {exam.questions.length}</div>
                  <div>Criado: {formatDistanceToNow(new Date(exam.createdAt), { 
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
              const exam = exams.find(e => e.id === submission.examId);
              if (!exam) return null;
              
              return (
                <div key={submission.id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                  <h3 className="text-lg font-semibold">{exam.title}</h3>
                  
                  <div className="mt-3 text-sm text-gray-500">
                    <div>Concluído: {formatDistanceToNow(new Date(submission.submittedAt), { 
                      addSuffix: true,
                      locale: ptBR 
                    })}</div>
                    <div className="font-medium text-primary">Nota: {submission.score?.toFixed(1)}%</div>
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
    </div>
  );
};
