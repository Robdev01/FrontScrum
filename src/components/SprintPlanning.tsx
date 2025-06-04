import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DraggableCard } from './DraggableCard';
import { useScrumContext } from '../context/ScrumContext';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

export const SprintPlanning: React.FC = () => {
  const { scrumData, addSprint, updateSprint, deleteSprint, deleteTask, moveTask, currentRole } = useScrumContext();
  const { toast } = useToast();
  const [isCreatingSprint, setIsCreatingSprint] = useState(false);
  const [newSprint, setNewSprint] = useState({
    name: '',
    goal: '',
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Default 2 weeks
    isActive: true,
  });
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    setDraggedTaskId(taskId);
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('dragging');
    setDraggedTaskId(null);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drop-active');
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('drop-active');
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, sprintId: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drop-active');
    const taskId = e.dataTransfer.getData('text/plain');
    
    if (taskId && draggedTaskId) {
      moveTask(taskId, 'todo', sprintId);
    }
  };

  const handleCreateSprint = () => {
    if (newSprint.name.trim() === '') return;
    
    addSprint({
      name: newSprint.name,
      goal: newSprint.goal,
      startDate: newSprint.startDate.toISOString(),
      endDate: newSprint.endDate.toISOString(),
      isActive: newSprint.isActive,
      tasks: [],
      completed: false,
      dailyNotes: {}
    });
    
    setNewSprint({
      name: '',
      goal: '',
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      isActive: true
    });
    
    setIsCreatingSprint(false);
    toast({
      title: "Sprint criada",
      description: "Nova sprint adicionada com sucesso",
    });
  };

  const handleActivateSprint = (sprintId: string) => {
    const sprint = scrumData.sprints.find(s => s.id === sprintId);
    if (sprint) {
      updateSprint({
        ...sprint,
        isActive: true
      });
    }
  };

  const handleDeleteSprint = (sprintId: string) => {
    deleteSprint(sprintId);
    toast({
      title: "Sprint deletada",
      description: "Sprint removida e tarefas movidas para o Product Backlog",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    toast({
      title: "Tarefa deletada",
      description: "Tarefa removida com sucesso",
    });
  };

  // Only Product Owner and Scrum Master can manage sprints
  const canManageSprints = ['product-owner', 'scrum-master'].includes(currentRole);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Planejamento de Sprint</h2>
        {canManageSprints && (
          <Button onClick={() => setIsCreatingSprint(true)}>
            <Plus size={16} className="mr-1" /> Nova Sprint
          </Button>
        )}
      </div>

      {scrumData.sprints.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Nenhuma Sprint Criada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-4">
              Não há Sprints criadas. {canManageSprints && 'Crie uma Sprint para começar.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {scrumData.sprints.map((sprint) => (
            <Card key={sprint.id} className={cn(
              "border-l-4",
              sprint.isActive ? "border-l-primary" : "border-l-muted"
            )}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{sprint.name}</CardTitle>
                  <div className="flex gap-2">
                    {canManageSprints && !sprint.isActive && (
                      <Button size="sm" variant="outline" onClick={() => handleActivateSprint(sprint.id)}>
                        Ativar Sprint
                      </Button>
                    )}
                    {canManageSprints && (
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDeleteSprint(sprint.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div>Meta: {sprint.goal || 'Sem meta definida'}</div>
                  <div className="flex gap-x-4 mt-1">
                    <div>Início: {format(new Date(sprint.startDate), 'dd/MM/yyyy')}</div>
                    <div>Fim: {format(new Date(sprint.endDate), 'dd/MM/yyyy')}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className="min-h-[150px] p-4 bg-secondary/50 rounded-md mt-2"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    e.currentTarget.classList.add('drop-active');
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('drop-active');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('drop-active');
                    const taskId = e.dataTransfer.getData('text/plain');
                    
                    if (taskId && draggedTaskId) {
                      moveTask(taskId, 'todo', sprint.id);
                    }
                  }}
                >
                  <h3 className="font-medium mb-4">Tarefas da Sprint</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {sprint.tasks.map(task => (
                      <div key={task.id} className="relative group">
                        <DraggableCard 
                          task={task} 
                          onDragStart={(e, taskId) => {
                            setDraggedTaskId(taskId);
                            e.currentTarget.classList.add('dragging');
                            e.dataTransfer.setData('text/plain', taskId);
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                          onDragEnd={(e) => {
                            e.currentTarget.classList.remove('dragging');
                            setDraggedTaskId(null);
                          }}
                        />
                        {canManageSprints && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <X size={12} />
                          </Button>
                        )}
                      </div>
                    ))}
                    {sprint.tasks.length === 0 && (
                      <div className="col-span-full text-center py-6 text-muted-foreground text-sm italic">
                        Arraste tarefas do Product Backlog para esta Sprint
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isCreatingSprint} onOpenChange={setIsCreatingSprint}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Criar Nova Sprint</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Sprint</Label>
              <Input 
                id="name" 
                value={newSprint.name} 
                onChange={(e) => setNewSprint({...newSprint, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Meta da Sprint</Label>
              <Textarea 
                id="goal" 
                value={newSprint.goal}
                rows={2}
                onChange={(e) => setNewSprint({...newSprint, goal: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="startDate"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(newSprint.startDate, 'dd/MM/yyyy')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newSprint.startDate}
                      onSelect={(date) => {
                        if (date) {
                          setNewSprint({...newSprint, startDate: date});
                          setStartDateOpen(false);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Data de Término</Label>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="endDate"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(newSprint.endDate, 'dd/MM/yyyy')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newSprint.endDate}
                      onSelect={(date) => {
                        if (date) {
                          setNewSprint({...newSprint, endDate: date});
                          setEndDateOpen(false);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreatingSprint(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateSprint}>
              Criar Sprint
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
