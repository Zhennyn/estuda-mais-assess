import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller, UseFormWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useExam } from '@/context/ExamContext';
import { useNavigate } from 'react-router-dom';
import { Exam, Question, QuestionOption } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, PlusCircle } from 'lucide-react';

const optionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'O texto da opção não pode ser vazio.'),
  is_correct: z.boolean(),
});

const questionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'O texto da pergunta não pode ser vazio.'),
  options: z.array(optionSchema).min(2, 'Cada pergunta deve ter pelo menos duas opções.'),
  // Garante que pelo menos uma opção seja marcada como correta
}).refine(data => data.options.some(opt => opt.is_correct), {
  message: "Cada pergunta deve ter pelo menos uma opção correta.",
  path: ["options"], 
});

const examSchema = z.object({
  title: z.string().min(1, 'O título não pode ser vazio.'),
  description: z.string().optional(),
  duration: z.coerce.number().int().positive('A duração deve ser um número positivo.'),
  questions: z.array(questionSchema).min(1, 'A prova deve ter pelo menos uma pergunta.'),
});

type ExamFormData = z.infer<typeof examSchema>;

interface ExamEditorProps {
  examId: string;
}

export const ExamEditor: React.FC<ExamEditorProps> = ({ examId }) => {
  const { getExamById, updateExam } = useExam();
  const navigate = useNavigate();
  
  const examToEdit = getExamById(examId);

  const { register, control, handleSubmit, formState: { errors }, reset, watch } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    // Default values will be set by the useEffect below once examToEdit is available
  });
  
  useEffect(() => {
    if (examToEdit) {
      reset({
        title: examToEdit.title,
        description: examToEdit.description || '',
        duration: examToEdit.duration,
        questions: examToEdit.questions.map(q => ({
          id: q.id,
          text: q.text,
          options: q.options.map(o => ({ 
            id: o.id,
            text: o.text,
            is_correct: o.is_correct 
          }))
        }))
      });
    } else {
      // Handle case where exam is not found after trying to fetch, though EditExamPage should catch this.
      // For now, initialize with empty/default if examToEdit is null/undefined initially
       reset({ title: '', description: '', duration: 60, questions: [] });
    }
  }, [examToEdit, reset]);


  const { fields: questions, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit = (data: ExamFormData) => {
    if (!examToEdit) {
      toast({ title: "Erro", description: "Prova original não encontrada para atualização.", variant: "destructive" });
      return;
    }
    const now = new Date().toISOString();

    const updatedExam: Exam = {
      ...examToEdit, // Preserva id, created_by, original created_at
      title: data.title,
      description: data.description,
      duration: data.duration,
      updated_at: now, // Update exam's updated_at
      questions: data.questions.map(q_form => {
        const originalQuestion = examToEdit.questions.find(oq => oq.id === q_form.id);
        return {
          // Spread q_form first to get id, text
          id: q_form.id,
          text: q_form.text,
          exam_id: examId, // Ensure exam_id is present
          created_at: originalQuestion ? originalQuestion.created_at : now,
          updated_at: now,
          options: q_form.options.map(opt_form => {
            const originalOption = originalQuestion?.options.find(oo => oo.id === opt_form.id);
            return {
              // Spread opt_form first to get id, text, is_correct
              id: opt_form.id,
              text: opt_form.text,
              is_correct: opt_form.is_correct,
              question_id: q_form.id, // Ensure question_id is present
              created_at: originalOption ? originalOption.created_at : now,
              updated_at: now,
            };
          }),
        };
      }),
    };

    updateExam(updatedExam);
    toast({
      title: 'Prova Atualizada!',
      description: `A prova "${updatedExam.title}" foi atualizada com sucesso.`,
    });
    navigate(`/professor/exam/${examId}`);
  };

  const handleAddQuestion = () => {
    const newQuestionId = uuidv4();
    appendQuestion({
      id: newQuestionId,
      text: '',
      options: [
        { id: uuidv4(), text: '', is_correct: false },
        { id: uuidv4(), text: '', is_correct: false },
      ],
      // Ensure schema-compatible structure, `exam_id` etc are added in onSubmit
    });
  };

  if (!examToEdit) {
    // This check is now more robust due to useEffect.
    // EditExamPage should handle the case where examId is invalid or exam truly not found.
    // Showing a loading state while examToEdit is initially undefined and useEffect hasn't run.
    return <p>Carregando dados da prova...</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Prova</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Título da Prova</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Descrição (Opcional)</Label>
            <Textarea id="description" {...register('description')} />
          </div>
          <div>
            <Label htmlFor="duration">Duração (minutos)</Label>
            <Input id="duration" type="number" {...register('duration')} />
            {errors.duration && <p className="text-sm text-destructive">{errors.duration.message}</p>}
          </div>
        </CardContent>
      </Card>

      {questions.map((question, qIndex) => (
        <Card key={question.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Questão {qIndex + 1}</CardTitle>
            <Button type="button" variant="ghost" size="sm" onClick={() => removeQuestion(qIndex)}>
              <Trash2 className="h-4 w-4 mr-1" /> Remover Questão
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor={`questions.${qIndex}.text`}>Texto da Questão</Label>
              <Textarea id={`questions.${qIndex}.text`} {...register(`questions.${qIndex}.text`)} />
              {errors.questions?.[qIndex]?.text && <p className="text-sm text-destructive">{errors.questions[qIndex]?.text?.message}</p>}
              {errors.questions?.[qIndex]?.options?.message && <p className="text-sm text-destructive">{errors.questions[qIndex]?.options?.message}</p>}
            </div>
            <OptionsEditor 
              questionIndex={qIndex} 
              control={control} 
              register={register} 
              errors={errors} 
              watch={watch} // Pass watch here
            />
          </CardContent>
        </Card>
      ))}
      {errors.questions?.root && <p className="text-sm text-destructive">{errors.questions.root.message}</p>}
      {errors.questions?.message && <p className="text-sm text-destructive">{errors.questions.message}</p>}


      <Button type="button" variant="outline" onClick={handleAddQuestion} className="mt-4">
        <PlusCircle className="h-4 w-4 mr-2" /> Adicionar Questão
      </Button>

      <div className="flex justify-end space-x-2 mt-8">
        <Button type="button" variant="outline" onClick={() => navigate(`/professor/exam/${examId}`)}>
          Cancelar
        </Button>
        <Button type="submit">Salvar Alterações</Button>
      </div>
    </form>
  );
};

interface OptionsEditorProps {
  questionIndex: number;
  control: any; // Consider using Control<ExamFormData>
  register: any; // Consider using UseFormRegister<ExamFormData>
  errors: any; // Consider using FieldErrors<ExamFormData>
  watch: UseFormWatch<ExamFormData>; // Use imported UseFormWatch
}

// Componente aninhado para gerenciar opções
const OptionsEditor: React.FC<OptionsEditorProps> = ({ questionIndex, control, register, errors, watch }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  const handleAddOption = () => {
    append({ id: uuidv4(), text: '', is_correct: false });
  };
  
  // watch is now correctly passed and typed
  const currentOptions = watch(`questions.${questionIndex}.options`);

  return (
    <div className="space-y-3 pl-4 border-l-2">
      <Label className="text-md">Opções</Label>
      {fields.map((option, oIndex) => (
        <div key={option.id} className="p-3 border rounded-md space-y-2 bg-muted/50">
          <div className="flex items-center justify-between">
             <Label htmlFor={`questions.${questionIndex}.options.${oIndex}.text`}>Opção {oIndex + 1}</Label>
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(oIndex)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Input
            id={`questions.${questionIndex}.options.${oIndex}.text`}
            {...register(`questions.${questionIndex}.options.${oIndex}.text`)}
            placeholder="Texto da opção"
          />
          {errors.questions?.[questionIndex]?.options?.[oIndex]?.text && (
            <p className="text-sm text-destructive">{errors.questions[questionIndex]?.options[oIndex]?.text?.message}</p>
          )}
          <div className="flex items-center space-x-2">
            <Controller
              name={`questions.${questionIndex}.options.${oIndex}.is_correct`}
              control={control}
              render={({ field }) => (
                <Checkbox
                  id={`questions.${questionIndex}.options.${oIndex}.is_correct`}
                  checked={field.value}
                  onCheckedChange={field.onChange} // Simplified
                />
              )}
            />
            <Label htmlFor={`questions.${questionIndex}.options.${oIndex}.is_correct`} className="font-normal">
              Opção Correta
            </Label>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
        <PlusCircle className="h-4 w-4 mr-2" /> Adicionar Opção
      </Button>
       {errors.questions?.[questionIndex]?.options?.message && (
            <p className="text-sm text-destructive">{errors.questions[questionIndex]?.options?.message}</p>
        )}
       {/* Display error if less than 2 options after adding/removing, or if no correct option */}
       {errors.questions?.[questionIndex]?.options?.root?.message && (
            <p className="text-sm text-destructive">{errors.questions[questionIndex]?.options?.root?.message}</p>
        )}
    </div>
  );
};
