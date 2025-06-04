
import React, { useState } from 'react';
import { DraggableCard } from './DraggableCard';
import { ProductBacklog } from './ProductBacklog';
import { SprintPlanning } from './SprintPlanning';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskStatus, useScrumContext } from '../context/ScrumContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { teamMembers } from '../utils/scrumData';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ScrumBoard: React.FC = () => {
  const { scrumData, moveTask, addTask, currentRole } = useScrumContext();
  const activeSprint = scrumData.sprints.find(sprint => sprint.isActive);
  
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    storyPoints: 1,
    status: 'todo' as TaskStatus
  });
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
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drop-active');
    const taskId = e.dataTransfer.getData('text/plain');
    
    if (taskId && draggedTaskId) {
      moveTask(taskId, status, activeSprint?.id);
    }
  };

  const handleAddTask = () => {
    if (newTask.title.trim() === '') return;
    
    addTask({
      title: newTask.title,
      description: newTask.description,
      assignee: newTask.assignee,
      storyPoints: newTask.storyPoints,
      status: newTask.status
    });
    
    setNewTask({
      title: '',
      description: '',
      assignee: '',
      storyPoints: 1,
      status: 'todo' as TaskStatus
    });
    
    setIsAddingTask(false);
  };

  // Check if user can add tasks based on role
  const canAddTasks = 
    (currentRole === 'product-owner') || 
    (currentRole === 'scrum-master') || 
    (currentRole === 'developer' && activeSprint);

  if (!activeSprint) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle className="text-center">Nenhuma Sprint Ativa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-4">
              Para visualizar o quadro Scrum, primeiro inicie uma Sprint no planejamento.
            </p>
            <div className="flex justify-center">
              <SprintPlanning />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const todoTasks = activeSprint.tasks.filter(task => task.status === 'todo');
  const doingTasks = activeSprint.tasks.filter(task => task.status === 'doing');
  const doneTasks = activeSprint.tasks.filter(task => task.status === 'done');

  return (
    <div className="mt-4">
      <Tabs defaultValue="board">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="board">Quadro Sprint</TabsTrigger>
          <TabsTrigger value="backlog">Backlog</TabsTrigger>
          <TabsTrigger value="planning">Planejamento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="board" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Sprint: {activeSprint.name}</h2>
            {canAddTasks && (
              <Button size="sm" onClick={() => setIsAddingTask(true)}>
                <Plus size={16} className="mr-1" /> Adicionar Tarefa
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className="board-column bg-card rounded-lg shadow p-4 min-h-[400px]"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'todo')}
            >
              <h3 className="font-medium mb-4 px-2 py-1 bg-scrum-todo text-center rounded-md">
                A Fazer ({todoTasks.length})
              </h3>
              <div className="space-y-3">
                {todoTasks.map(task => (
                  <DraggableCard 
                    key={task.id} 
                    task={task} 
                    onDragStart={handleDragStart} 
                    onDragEnd={handleDragEnd} 
                  />
                ))}
                {todoTasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm italic">
                    Nenhuma tarefa a fazer
                  </div>
                )}
              </div>
            </div>
            
            <div 
              className="board-column bg-card rounded-lg shadow p-4 min-h-[400px]"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'doing')}
            >
              <h3 className="font-medium mb-4 px-2 py-1 bg-scrum-doing text-center rounded-md">
                Em Progresso ({doingTasks.length})
              </h3>
              <div className="space-y-3">
                {doingTasks.map(task => (
                  <DraggableCard 
                    key={task.id} 
                    task={task} 
                    onDragStart={handleDragStart} 
                    onDragEnd={handleDragEnd} 
                  />
                ))}
                {doingTasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm italic">
                    Nenhuma tarefa em progresso
                  </div>
                )}
              </div>
            </div>
            
            <div 
              className="board-column bg-card rounded-lg shadow p-4 min-h-[400px]"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'done')}
            >
              <h3 className="font-medium mb-4 px-2 py-1 bg-scrum-done text-center rounded-md">
                Concluído ({doneTasks.length})
              </h3>
              <div className="space-y-3">
                {doneTasks.map(task => (
                  <DraggableCard 
                    key={task.id} 
                    task={task} 
                    onDragStart={handleDragStart} 
                    onDragEnd={handleDragEnd} 
                  />
                ))}
                {doneTasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm italic">
                    Nenhuma tarefa concluída
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="backlog" className="mt-4">
          <ProductBacklog />
        </TabsContent>
        
        <TabsContent value="planning" className="mt-4">
          <SprintPlanning />
        </TabsContent>
      </Tabs>

      <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input 
                id="title" 
                value={newTask.title} 
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description" 
                value={newTask.description}
                rows={3}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignee">Responsável</Label>
                <Select 
                  value={newTask.assignee} 
                  onValueChange={(value) => setNewTask({...newTask, assignee: value})}
                >
                  <SelectTrigger id="assignee">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Sem responsável</SelectItem>
                    {teamMembers.map((member) => (
                      <SelectItem key={member} value={member}>
                        {member}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="points">Story Points</Label>
                <Select 
                  value={newTask.storyPoints.toString()} 
                  onValueChange={(value) => setNewTask({...newTask, storyPoints: parseInt(value)})}
                >
                  <SelectTrigger id="points">
                    <SelectValue placeholder="Pontos" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 5, 8, 13, 21].map((points) => (
                      <SelectItem key={points} value={points.toString()}>
                        {points}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={newTask.status} 
                onValueChange={(value) => setNewTask({...newTask, status: value as TaskStatus})}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">A Fazer</SelectItem>
                  <SelectItem value="doing">Em Progresso</SelectItem>
                  <SelectItem value="done">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddingTask(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddTask}>
              Adicionar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
