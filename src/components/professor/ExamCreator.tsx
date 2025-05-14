
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { useExam } from "@/context/ExamContext";
import { Question } from "@/types";

export const ExamCreator = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const { createExam } = useExam();
  
  const [examTitle, setExamTitle] = useState("");
  const [examDescription, setExamDescription] = useState("");
  const [examDuration, setExamDuration] = useState(60); // default 60 minutes
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: uuidv4(),
    text: "",
    options: [
      { id: uuidv4(), text: "", isCorrect: false },
      { id: uuidv4(), text: "", isCorrect: false },
      { id: uuidv4(), text: "", isCorrect: false },
      { id: uuidv4(), text: "", isCorrect: false }
    ]
  });

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = { ...updatedOptions[index], text: value };
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  const handleCorrectOptionChange = (index: number) => {
    const updatedOptions = currentQuestion.options.map((option, i) => ({
      ...option,
      isCorrect: i === index
    }));
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  const addQuestion = () => {
    // Validate question
    if (!currentQuestion.text.trim()) {
      toast({
        title: "Erro",
        description: "O texto da questão é obrigatório",
        variant: "destructive"
      });
      return;
    }

    // Check if options are filled
    const emptyOptions = currentQuestion.options.filter(opt => !opt.text.trim());
    if (emptyOptions.length > 0) {
      toast({
        title: "Erro",
        description: "Preencha todas as opções da questão",
        variant: "destructive"
      });
      return;
    }

    // Check if there's a correct option
    const hasCorrect = currentQuestion.options.some(opt => opt.isCorrect);
    if (!hasCorrect) {
      toast({
        title: "Erro",
        description: "Selecione uma opção correta",
        variant: "destructive"
      });
      return;
    }

    // Add question to the list
    setQuestions([...questions, currentQuestion]);
    
    // Reset current question
    setCurrentQuestion({
      id: uuidv4(),
      text: "",
      options: [
        { id: uuidv4(), text: "", isCorrect: false },
        { id: uuidv4(), text: "", isCorrect: false },
        { id: uuidv4(), text: "", isCorrect: false },
        { id: uuidv4(), text: "", isCorrect: false }
      ]
    });

    toast({
      title: "Sucesso",
      description: "Questão adicionada com sucesso!"
    });
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const handleSubmit = () => {
    if (!user) return;

    // Validate exam
    if (!examTitle.trim()) {
      toast({
        title: "Erro",
        description: "O título da prova é obrigatório",
        variant: "destructive"
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma questão à prova",
        variant: "destructive"
      });
      return;
    }

    // Create the exam
    createExam({
      id: uuidv4(),
      title: examTitle,
      description: examDescription,
      createdBy: user.id,
      createdAt: new Date(),
      duration: examDuration,
      questions: questions
    });

    // Reset form
    setExamTitle("");
    setExamDescription("");
    setExamDuration(60);
    setQuestions([]);

    toast({
      title: "Sucesso",
      description: "Prova criada com sucesso!"
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Criar Nova Prova</h2>
        
        <div className="space-y-2">
          <Label htmlFor="examTitle">Título da Prova</Label>
          <Input
            id="examTitle"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            placeholder="Ex: Prova de Matemática - 2º Bimestre"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="examDescription">Descrição (opcional)</Label>
          <Input
            id="examDescription"
            value={examDescription}
            onChange={(e) => setExamDescription(e.target.value)}
            placeholder="Ex: Conteúdo: Álgebra e Geometria"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="examDuration">Duração (minutos)</Label>
          <Input
            id="examDuration"
            type="number"
            min="1"
            value={examDuration}
            onChange={(e) => setExamDuration(parseInt(e.target.value) || 60)}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-xl font-semibold mb-4">Adicionar Questão</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="questionText">Texto da Questão</Label>
            <Input
              id="questionText"
              value={currentQuestion.text}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
              placeholder="Digite o enunciado da questão"
            />
          </div>
          
          <div className="space-y-4">
            <Label>Opções de Resposta</Label>
            
            {currentQuestion.options.map((option, index) => (
              <div key={option.id} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="correctOption"
                  checked={option.isCorrect}
                  onChange={() => handleCorrectOptionChange(index)}
                />
                <Input
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Opção ${index + 1}`}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
          
          <Button onClick={addQuestion} type="button" className="mt-2">
            Adicionar Questão
          </Button>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Questões da Prova ({questions.length})</h3>
          
          <div className="space-y-4">
            {questions.map((question, qIndex) => (
              <div key={question.id} className="border p-4 rounded-md">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">Questão {qIndex + 1}</h4>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => removeQuestion(question.id)}
                  >
                    Remover
                  </Button>
                </div>
                
                <p className="my-2">{question.text}</p>
                
                <div className="ml-4 space-y-1">
                  {question.options.map((option, oIndex) => (
                    <div key={option.id} className="flex items-center">
                      <span className={option.isCorrect ? "text-green-600 font-medium" : ""}>
                        {String.fromCharCode(65 + oIndex)}. {option.text} 
                        {option.isCorrect && " ✓"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {questions.length > 0 && (
        <div className="pt-4">
          <Button onClick={handleSubmit} className="w-full">
            Finalizar e Criar Prova
          </Button>
        </div>
      )}
    </div>
  );
};
