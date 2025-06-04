
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RoleSelector } from './RoleSelector';
import { useScrumContext } from '../context/ScrumContext';
import { Info } from 'lucide-react';

export const Header: React.FC = () => {
  const { scrumData, toggleTutorial, resetData } = useScrumContext();
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);

  const handleResetClick = () => {
    setIsResetting(true);
  };

  const confirmReset = () => {
    resetData();
    toast({
      title: "Dados reiniciados com sucesso",
      description: "O projeto voltou ao estado inicial",
    });
    setIsResetting(false);
  };

  const cancelReset = () => {
    setIsResetting(false);
  };

  return (
    <header className="bg-primary py-4 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Scrum Vivo</h1>
            <p className="text-sm opacity-90">Aprendento e praticando a metogologia Scrum</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <RoleSelector />
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-primary-foreground hover:bg-primary-foreground/20"
                onClick={toggleTutorial}
              >
                <Info size={16} className="mr-1" />
                {scrumData.showTutorial ? 'Fechar Tutorial' : 'Tutorial'}
              </Button>

              {isResetting ? (
                <div className="flex gap-2">
                  <Button variant="destructive" size="sm" onClick={confirmReset}>
                    Confirmar
                  </Button>
                  <Button variant="outline" size="sm" onClick={cancelReset} className="text-primary-foreground hover:bg-primary-foreground/20">
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={handleResetClick}
                >
                  Reiniciar Projeto
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
