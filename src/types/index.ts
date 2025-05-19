
// Supabase vai gerar automaticamente src/integrations/supabase/types.ts com os tipos do banco.
// Estes são tipos frontend que podem ser um pouco diferentes ou combinar dados.
import { Database } from "@/integrations/supabase/types";

// Usando os tipos gerados pelo Supabase onde possível
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type UserRole = Database['public']['Tables']['user_roles']['Row']['role']; // 'professor' | 'student'

export interface User extends Profile {
  // id, name, email, created_at já vêm de Profile
  role: UserRole;
}

export type QuestionOption = Database['public']['Tables']['options']['Row'];
export type Question = Omit<Database['public']['Tables']['questions']['Row'], 'exam_id'> & {
  exam_id: string; // Mantendo como string para consistência com o uso anterior, mas é UUID no DB
  options: QuestionOption[];
};

export type Exam = Omit<Database['public']['Tables']['exams']['Row'], 'created_by'> & {
  created_by: string; // Mantendo como string, mas é UUID no DB
  questions: Question[];
};

export type Answer = Omit<Database['public']['Tables']['answers']['Row'], 'submission_id' | 'question_id' | 'selected_option_id'> & {
  submission_id: string;
  question_id: string;
  selected_option_id: string | null;
};

export type ExamSubmission = Omit<Database['public']['Tables']['exam_submissions']['Row'], 'exam_id' | 'student_id'> & {
  exam_id: string;
  student_id: string;
  answers: Answer[];
  // score já é parte de exam_submissions no DB
};

// Para garantir que não haja conflito com os nomes originais, vamos re-exportar os tipos do Supabase se necessário
// ou criar aliases mais específicos se os tipos acima forem muito customizados.
// Por ora, os tipos acima tentam manter a forma que a aplicação já espera, adaptando-se aos nomes de colunas do DB.

