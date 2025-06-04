
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ScrumProvider } from "@/context/ScrumContext";
import { Navigate } from "react-router-dom";
import { loadData, saveData } from "@/utils/localStorage";
import { UserPlus, User } from "lucide-react";

interface Developer {
  id: string;
  name: string;
  email: string;
  role: string;
}

const Admin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("developer");
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const user = loadData("scrum_user");

  // Load developers from localStorage
  useEffect(() => {
    const savedDevelopers = loadData("scrum_developers") || [];
    setDevelopers(savedDevelopers);
  }, []);

  // Check if current user has admin permission
  if (!user || user.role !== "admin") {
    toast("Acesso negado. Você precisa ser um administrador.");
    return <Navigate to="/dashboard" />;
  }

  const handleAddDeveloper = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!name.trim() || !email.trim()) {
      toast("Por favor, preencha todos os campos");
      return;
    }
    
    // Check for duplicate email
    if (developers.some(dev => dev.email === email.trim())) {
      toast("Este email já está cadastrado");
      return;
    }
    
    const newDeveloper: Developer = {
      id: `dev-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role
    };
    
    const updatedDevelopers = [...developers, newDeveloper];
    setDevelopers(updatedDevelopers);
    saveData("scrum_developers", updatedDevelopers);
    
    // Reset form
    setName("");
    setEmail("");
    setRole("developer");
    
    toast("Desenvolvedor adicionado com sucesso!");
  };

  return (
    <ScrumProvider>
      <Layout>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-6 w-6" />
                Adicionar Desenvolvedor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddDeveloper}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      placeholder="Nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Função</Label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="developer">Desenvolvedor</option>
                      <option value="scrum-master">Scrum Master</option>
                      <option value="product-owner">Product Owner</option>
                    </select>
                  </div>
                  
                  <Button type="submit" className="w-full">Adicionar Desenvolvedor</Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6" />
                Desenvolvedores Cadastrados ({developers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {developers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum desenvolvedor cadastrado
                  </p>
                ) : (
                  <div className="border rounded-md divide-y">
                    {developers.map((dev) => (
                      <div key={dev.id} className="p-4">
                        <h3 className="font-medium">{dev.name}</h3>
                        <p className="text-sm text-muted-foreground">{dev.email}</p>
                        <span className="inline-block mt-1 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                          {dev.role === "developer" ? "Desenvolvedor" : 
                           dev.role === "scrum-master" ? "Scrum Master" : "Product Owner"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ScrumProvider>
  );
};

export default Admin;
