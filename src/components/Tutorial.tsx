
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { roleDescriptions, scrumCeremonies } from '../utils/scrumData';
import { useScrumContext } from '../context/ScrumContext';
import { X } from 'lucide-react';

export const Tutorial: React.FC = () => {
  const { toggleTutorial, currentRole } = useScrumContext();

  return (
    <div className="mb-6 animate-fade-in">
      <Alert className="bg-accent/50 border border-accent">
        <div className="flex justify-between items-start">
          <div>
            <AlertTitle className="text-lg font-semibold mb-2">
              Bem-vindo ao Simulador Scrum!
            </AlertTitle>
            <AlertDescription className="text-muted-foreground">
              Este simulador permite que você aprenda e pratique a metodologia Scrum de forma interativa.
              Utilize as abas abaixo para aprender mais sobre os conceitos do Scrum.
            </AlertDescription>
          </div>
          <button 
            onClick={toggleTutorial} 
            className="p-1 rounded-full hover:bg-background/80"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="roles">Papéis</TabsTrigger>
              <TabsTrigger value="ceremonies">Cerimônias</TabsTrigger>
              <TabsTrigger value="artifacts">Artefatos</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="p-4 bg-background rounded-md mt-2">
              <h3 className="text-lg font-medium mb-2">O que é Scrum?</h3>
              <p className="mb-4">
                Scrum é um framework ágil para gerenciar projetos complexos. 
                Ele divide o trabalho em ciclos chamados Sprints, geralmente de 1-4 semanas.
              </p>
              <p>
                Este simulador permite que você experimente o fluxo de trabalho Scrum, 
                gerenciando tarefas do Product Backlog, planejando Sprints e movendo tarefas 
                pelo quadro Scrum (To Do, Doing, Done).
              </p>
            </TabsContent>
            <TabsContent value="roles" className="p-4 bg-background rounded-md mt-2">
              <h3 className="text-lg font-medium mb-4">Papéis no Scrum</h3>
              <div className="space-y-4">
                <div className="p-3 border rounded-md">
                  <h4 className="font-medium text-sm text-scrum-po">Product Owner</h4>
                  <p className="text-sm">{roleDescriptions['product-owner']}</p>
                </div>
                <div className="p-3 border rounded-md">
                  <h4 className="font-medium text-sm text-scrum-sm">Scrum Master</h4>
                  <p className="text-sm">{roleDescriptions['scrum-master']}</p>
                </div>
                <div className="p-3 border rounded-md">
                  <h4 className="font-medium text-sm text-scrum-dev">Time de Desenvolvimento</h4>
                  <p className="text-sm">{roleDescriptions['developer']}</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  Você está atualmente no papel de <span className="font-medium">{
                    currentRole === 'product-owner' ? 'Product Owner' :
                    currentRole === 'scrum-master' ? 'Scrum Master' : 'Desenvolvedor'
                  }</span>.
                </p>
                <p>Você pode mudar seu papel a qualquer momento usando o seletor no topo da página.</p>
              </div>
            </TabsContent>
            <TabsContent value="ceremonies" className="p-4 bg-background rounded-md mt-2">
              <h3 className="text-lg font-medium mb-4">Cerimônias Scrum</h3>
              <div className="space-y-4">
                {scrumCeremonies.map((ceremony) => (
                  <div key={ceremony.name} className="p-3 border rounded-md">
                    <h4 className="font-medium text-sm">{ceremony.name}</h4>
                    <p className="text-sm mb-1">{ceremony.description}</p>
                    <div className="text-xs text-muted-foreground">
                      <p><span className="font-medium">Participantes:</span> {ceremony.participants.join(', ')}</p>
                      <p><span className="font-medium">Duração:</span> {ceremony.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="artifacts" className="p-4 bg-background rounded-md mt-2">
              <h3 className="text-lg font-medium mb-2">Artefatos Scrum</h3>
              <div className="space-y-4">
                <div className="p-3 border rounded-md">
                  <h4 className="font-medium text-sm">Product Backlog</h4>
                  <p className="text-sm">
                    Uma lista ordenada de tudo o que é necessário no produto. É a única fonte de requisitos para qualquer mudança a ser feita.
                    O Product Owner é responsável pelo Product Backlog.
                  </p>
                </div>
                <div className="p-3 border rounded-md">
                  <h4 className="font-medium text-sm">Sprint Backlog</h4>
                  <p className="text-sm">
                    Um conjunto de itens do Product Backlog selecionados para a Sprint, juntamente com um plano para entregar o Incremento do produto e atingir o objetivo da Sprint.
                  </p>
                </div>
                <div className="p-3 border rounded-md">
                  <h4 className="font-medium text-sm">Incremento</h4>
                  <p className="text-sm">
                    A soma de todos os itens do Product Backlog completados durante uma Sprint e o valor de todos os incrementos anteriores.
                    Deve estar na condição de "Pronto" ao final da Sprint.
                  </p>
                </div>
                <div className="p-3 border rounded-md">
                  <h4 className="font-medium text-sm">Burndown Chart</h4>
                  <p className="text-sm">
                    Um gráfico que mostra a quantidade de trabalho restante na Sprint ao longo do tempo. Ajuda a equipe a monitorar o progresso e estimar se conseguirá completar todas as tarefas planejadas.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Alert>
    </div>
  );
};
