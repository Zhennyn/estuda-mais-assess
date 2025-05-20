import React from "react";
import { useParams, Link } from "react-router-dom";
import { useExam } from "@/context/ExamContext";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react"; // Icons for status

const PASSING_SCORE = 60; // Define passing score threshold

export const ExamResult = () => {
  const { submissionId } = useParams();
  const { examSubmissions, getExamById } = useExam();
  
  const submission = submissionId 
    ? examSubmissions.find(s => s.id === submissionId) 
    : undefined;
    
  const exam = submission 
    ? getExamById(submission.exam_id) 
    : undefined;
    
  if (!submission || !exam) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-medium text-gray-600">Resultado não encontrado.</h3>
        <Link to="/student/dashboard" className="mt-4 inline-block">
          <Button>Voltar para o Dashboard</Button>
        </Link>
      </div>
    );
  }
  
  // Calculate correct answers and score
  const totalQuestions = exam.questions.length;
  const correctAnswers = submission.answers.filter(answer => {
    const question = exam.questions.find(q => q.id === answer.question_id);
    if (!question) return false;
    
    const correctOption = question.options.find(o => o.is_correct);
    return correctOption && correctOption.id === answer.selected_option_id;
  }).length;
  
  const score = submission.score || 0;
  const isApproved = score >= PASSING_SCORE;
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{exam.title} - Resultado</h1>
        <p className="text-gray-600 mt-1">{exam.description}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <h2 className="text-lg font-medium">Pontuação</h2>
            <div className={`mt-1 flex items-center ${isApproved ? "text-green-600" : "text-red-600"}`}>
              {isApproved ? <CheckCircle2 className="mr-2" /> : <XCircle className="mr-2" />}
              <span className="font-semibold">{isApproved ? "Aprovado" : "Reprovado"}</span>
            </div>
          </div>
          <div className="text-2xl font-bold">{score.toFixed(1)}%</div>
        </div>
        
        <div className="py-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-gray-500">Questões</div>
            <div className="text-xl font-medium">{correctAnswers} / {totalQuestions}</div>
          </div>
          <div>
            <div className="text-gray-500">Acertos</div>
            <div className="text-xl font-medium">{correctAnswers}</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Detalhes da Prova</h2>
        
        {exam.questions.map((question, qIndex) => {
          const userAnswer = submission.answers.find(a => a.question_id === question.id);
          const userSelectedOption = userAnswer 
            ? question.options.find(o => o.id === userAnswer.selected_option_id) 
            : undefined;
            
          const correctOption = question.options.find(o => o.is_correct);
          const isCorrect = userSelectedOption && correctOption && userSelectedOption.id === correctOption.id;
          
          return (
            <div key={question.id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="mr-3 text-gray-500 font-medium">{qIndex + 1}.</div>
                <div className="flex-1">
                  <div className="font-medium mb-3">{question.text}</div>
                  
                  <div className="space-y-2 ml-1">
                    {question.options.map((option, oIndex) => {
                      const isUserSelection = userSelectedOption && userSelectedOption.id === option.id;
                      const isCorrectOption = option.is_correct;
                      
                      let bgColor = "";
                      if (isUserSelection && isCorrectOption) {
                        bgColor = "bg-green-100 border-green-300";
                      } else if (isUserSelection && !isCorrectOption) {
                        bgColor = "bg-red-100 border-red-300";
                      } else if (isCorrectOption) {
                        bgColor = "bg-green-50 border-green-200";
                      } else {
                        bgColor = "bg-white border-gray-200"; // Default for non-selected, non-correct options
                      }
                      
                      return (
                        <div 
                          key={option.id} 
                          className={`p-2 border rounded ${bgColor}`}
                        >
                          <div className="flex items-center">
                            <div className="w-6 text-gray-500">{String.fromCharCode(65 + oIndex)}.</div>
                            <span>{option.text}</span>
                            {isCorrectOption && !isUserSelection && ( // Show if it's correct and user didn't pick it
                              <span className="ml-2 text-green-700 text-xs font-medium">(Correta)</span>
                            )}
                             {isUserSelection && isCorrectOption && (
                              <span className="ml-2 text-green-700 text-xs font-medium">✓ Sua Resposta Correta</span>
                            )}
                            {isUserSelection && !isCorrectOption && (
                              <span className="ml-2 text-red-700 text-xs font-medium">✗ Sua Resposta Incorreta</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="ml-4 flex-shrink-0">
                  {isCorrect ? (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600" title="Correta">
                      <CheckCircle2 size={20}/>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600" title="Incorreta">
                      <XCircle size={20}/>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8">
        <Link to="/student/dashboard">
          <Button>Voltar ao Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};
