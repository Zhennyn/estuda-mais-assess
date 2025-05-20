import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";
import { ExamProvider } from "@/context/ExamContext";
import { ProfessorExamDetails } from "@/components/professor/ProfessorExamDetails";

// Importações das páginas
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import ProfessorDashboard from "@/pages/ProfessorDashboard";
import CreateExam from "@/pages/CreateExam";
import StudentDashboard from "@/pages/StudentDashboard";
import TakeExam from "@/pages/TakeExam";
import ExamResultPage from "@/pages/ExamResult";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ 
  children, 
  allowedRole 
}: { 
  children: React.ReactNode,
  allowedRole?: "professor" | "student"
}) => {
  const { user, isLoading, session } = useUser();
  
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }
  
  if (!user || !session) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }
  
  return children;
};

// Main app component
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<Login />} />
    
    {/* Professor routes */}
    <Route 
      path="/professor/dashboard" 
      element={
        <ProtectedRoute allowedRole="professor">
          <ProfessorDashboard />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/professor/create-exam" 
      element={
        <ProtectedRoute allowedRole="professor">
          <CreateExam />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/professor/exam/:examId" 
      element={
        <ProtectedRoute allowedRole="professor">
          <ProfessorExamDetails />
        </ProtectedRoute>
      } 
    />
    
    {/* Student routes */}
    <Route 
      path="/student/dashboard" 
      element={
        <ProtectedRoute allowedRole="student">
          <StudentDashboard />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/student/exam/:examId" 
      element={
        <ProtectedRoute allowedRole="student">
          <TakeExam />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/student/result/:submissionId" 
      element={
        <ProtectedRoute allowedRole="student">
          <ExamResultPage />
        </ProtectedRoute>
      } 
    />
    
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <BrowserRouter>
        <ExamProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </TooltipProvider>
        </ExamProvider>
      </BrowserRouter>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
