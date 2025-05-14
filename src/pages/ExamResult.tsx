
import React from "react";
import { Header } from "@/components/Header";
import { ExamResult } from "@/components/student/ExamResult";

const ExamResultPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto py-8">
        <ExamResult />
      </div>
    </div>
  );
};

export default ExamResultPage;
