
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ExamCreator } from "@/components/professor/ExamCreator";
import { ExamList } from "@/components/professor/ExamList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProfessorDashboard = () => {
  const [activeTab, setActiveTab] = useState("exams");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard do Professor</h1>
          
          <Link to="/professor/create-exam">
            <Button>Nova Prova</Button>
          </Link>
        </div>
        
        <Tabs 
          defaultValue="exams"
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="exams">Minhas Provas</TabsTrigger>
            <TabsTrigger value="create">Criar Prova</TabsTrigger>
          </TabsList>
          
          <TabsContent value="exams">
            <ExamList />
          </TabsContent>
          
          <TabsContent value="create">
            <ExamCreator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfessorDashboard;
