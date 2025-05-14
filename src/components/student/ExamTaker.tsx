
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/context/UserContext";
import { useExam } from "@/context/ExamContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Question } from "@/types";

export const ExamTaker = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { getExamById, submitExam } = useExam();
  const { toast } = useToast();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string, selectedOptionId: string }[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const exam = examId ? getExamById(examId) : undefined;
  
  useEffect(() => {
    if (exam) {
      setTimeLeft(exam.duration * 60); // Convert minutes to seconds
    }
  }, [exam]);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitExam();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);
  
  if (!exam || !user) {
    return <div>Carregando...</div>;
  }
  
  const currentQuestion = exam.questions[currentQuestionIndex];
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleAnswer = (questionId: string, optionId: string) => {
    const newAnswers = [...answers];
    const existingAnswerIndex = answers.findIndex(a => a.questionId === questionId);
    
    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex].selectedOptionId = optionId;
    } else {
      newAnswers.push({ questionId, selectedOptionId: optionId });
    }
    
    setAnswers(newAnswers);
  };
  
  const getCurrentAnswer = (questionId: string) => {
    return answers.find(a => a.questionId === questionId)?.selectedOptionId;
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleSubmitExam = () => {
    // Check if all questions are answered
    if (answers.length < exam.questions.length) {
      const isConfirmed = window.confirm("Você não respondeu todas as questões. Tem certeza que deseja enviar a prova?");
      if (!isConfirmed) return;
    }
    
    const submission = {
      id: uuidv4(),
      examId: exam.id,
      studentId: user.id,
      submittedAt: new Date(),
      answers
    };
    
    submitExam(submission);
    
    toast({
      title: "Prova enviada com sucesso!",
      description: "Você será redirecionado para ver seu resultado."
    });
    
    navigate(`/student/result/${submission.id}`);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{exam.title}</h1>
        <div className="text-lg font-medium">
          Tempo: <span className={timeLeft < 60 ? "text-red-600" : ""}>{formatTime(timeLeft)}</span>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            Questão {currentQuestionIndex + 1} de {exam.questions.length}
          </span>
          <span className="text-sm font-medium">
            {answers.length} de {exam.questions.length} respondidas
          </span>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">{currentQuestion.text}</h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div 
                key={option.id} 
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  getCurrentAnswer(currentQuestion.id) === option.id 
                    ? 'bg-primary/10 border-primary' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleAnswer(currentQuestion.id, option.id)}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full border ${
                    getCurrentAnswer(currentQuestion.id) === option.id 
                      ? 'border-primary bg-primary text-white' 
                      : 'border-gray-300'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="ml-3">{option.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Anterior
          </Button>
          
          {currentQuestionIndex < exam.questions.length - 1 ? (
            <Button onClick={handleNextQuestion}>Próxima</Button>
          ) : (
            <Button onClick={handleSubmitExam}>Finalizar Prova</Button>
          )}
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-10 gap-2">
        {exam.questions.map((question: Question, index: number) => {
          const isAnswered = answers.some(a => a.questionId === question.id);
          return (
            <Button
              key={question.id}
              variant={isAnswered ? "default" : "outline"}
              className={`w-10 h-10 p-0 ${currentQuestionIndex === index ? 'ring-2 ring-primary ring-offset-2' : ''}`}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
