import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useExam } from "@/context/ExamContext";
import { useUser } from "@/context/UserContext"; // Para obter dados do perfil (nome do aluno)
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { Trash2, Edit, Eye } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Este é um placeholder. Em uma aplicação real, você teria uma forma de buscar perfis de usuários.
// Poderia ser um contexto separado, uma query ao Supabase, etc.
const MOCK_USER_PROFILES: { [key: string]: { name?: string; email?: string } } = {
  "student1_id": { name: "Aluno Exemplo 1", email: "aluno1@example.com" },
  "student2_id": { name: "Aluna Teste B", email: "aluno2@example.com" },
  // Adicione mais perfis mockados conforme necessário
};

const getStudentName = (studentId: string, profiles: typeof MOCK_USER_PROFILES) => {
  return profiles[studentId]?.name || studentId; // Fallback to ID if name not found
}

export const ProfessorExamDetails = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { getExamById, getSubmissionsByExamId, deleteExam } = useExam();
  // const { profiles } = useProfiles(); // Supondo que você tenha um hook para perfis

  const exam = examId ? getExamById(examId) : undefined;
  const submissions = examId ? getSubmissionsByExamId(examId) : [];

  if (!exam) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-xl">Prova não encontrada.</p>
        <Link to="/professor/dashboard">
          <Button variant="outline" className="mt-4">Voltar ao Dashboard</Button>
        </Link>
      </div>
    );
  }

  const handleDeleteExam = () => {
    if (examId) {
      deleteExam(examId, navigate); // Modificado para passar navigate
      toast({
        title: "Prova Excluída",
        description: `A prova "${exam.title}" foi excluída com sucesso.`,
      });
      navigate("/professor/dashboard"); 
    }
  };

  const handleEditExam = () => {
    if (examId) {
      navigate(`/professor/edit-exam/${examId}`); // Navega para a nova página de edição
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{exam.title}</h1>
          {exam.description && <p className="text-muted-foreground mt-1">{exam.description}</p>}
          <div className="text-sm text-muted-foreground mt-2">
            <span>Duração: {exam.duration} minutos</span> | <span>Questões: {exam.questions.length}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleEditExam}>
            <Edit className="mr-2 h-4 w-4" /> Editar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" /> Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir a prova "{exam.title}"? Esta ação não pode ser desfeita. Todas as submissões relacionadas também podem ser afetadas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteExam} className="bg-destructive hover:bg-destructive/90">
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Questões da Prova</h2>
        <div className="space-y-6">
          {exam.questions.map((question, qIndex) => (
            <div key={question.id} className="p-4 border rounded-lg bg-card">
              <p className="font-medium mb-2">
                {qIndex + 1}. {question.text}
              </p>
              <ul className="space-y-1 list-inside list-disc ml-4">
                {question.options.map((option) => (
                  <li key={option.id} className={`${option.is_correct ? "text-green-600 font-semibold" : "text-muted-foreground"}`}>
                    {option.text} {option.is_correct && "(Correta)"}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Submissões dos Alunos</h2>
        {submissions.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead className="text-right">Nota</TableHead>
                  <TableHead>Data da Submissão</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">
                      {getStudentName(submission.student_id, MOCK_USER_PROFILES)}
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${submission.score && submission.score >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                      {submission.score !== null && submission.score !== undefined ? `${submission.score.toFixed(1)}%` : "N/A"}
                    </TableCell>
                    <TableCell>
                      {format(new Date(submission.submitted_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => alert(`Ver detalhes da submissão de ${submission.student_id} - A implementar`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhum aluno realizou esta prova ainda.</p>
        )}
      </div>
      <Link to="/professor/dashboard">
         <Button variant="outline" className="mt-8">Voltar ao Dashboard</Button>
      </Link>
    </div>
  );
};
