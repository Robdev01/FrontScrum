import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DraggableCard } from './DraggableCard';
import { TaskStatus, useScrumContext } from '../context/ScrumContext';
import { teamMembers } from '../utils/scrumData';
import { Book, Plus, X, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export const ProductBacklog: React.FC = () => {
  const { scrumData, addTask, moveTask, deleteTask, currentRole, isLoading } = useScrumContext();
  const { productBacklog } = scrumData;
  const { toast } = useToast();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    storyPoints: 1
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

  const handleAddTask = async () => {
    if (newTask.title.trim() === '') return;
    
    try {
      setIsSubmitting(true);
      await addTask({
        title: newTask.title,
        description: newTask.description,
        assignee: newTask.assignee,
        storyPoints: newTask.storyPoints,
        status: 'product-backlog'
      });
      
      setNewTask({
        title: '',
        description: '',
        assignee: '',
        storyPoints: 1
      });
      
      setIsAddingTask(false);
      toast({
        title: "Tarefa adicionada",
        description: "Nova tarefa adicionada ao Product Backlog",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar tarefa. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      toast({
        title: "Tarefa deletada",
        description: "Tarefa removida do Product Backlog",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao deletar tarefa. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Only Product Owner and Scrum Master can add to backlog
  const canAddToBacklog = ['product-owner', 'scrum-master'].includes(currentRole);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Book size={24} className="text-scrum-product-backlog mr-2" />
          <h2 className="text-xl font-bold">Product Backlog</h2>
          {isLoading && <Loader2 size={16} className="ml-2 animate-spin" />}
        </div>
        {canAddToBacklog && (
          <Button onClick={() => setIsAddingTask(true)} disabled={isLoading}>
            <Plus size={16} className="mr-1" /> Nova Tarefa
          </Button>
        )}
      </div>

      {productBacklog.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Backlog Vazio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              {isLoading ? 'Carregando tarefas...' : `Não há itens no Product Backlog. ${canAddToBacklog ? 'Adicione tarefas para começar.' : ''}`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 max-w-3xl mx-auto">
          {productBacklog.map((task) => (
            <div key={task.id} className="relative group">
              <DraggableCard
                task={task}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
              {canAddToBacklog && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteTask(task.id)}
                  disabled={isLoading}
                >
                  <X size={12} />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Item ao Product Backlog</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input 
                id="title" 
                value={newTask.title} 
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description" 
                value={newTask.description}
                rows={3}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignee">Responsável</Label>
                <Select 
                  value={newTask.assignee} 
                  onValueChange={(value) => setNewTask({...newTask, assignee: value})}
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddingTask(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={handleAddTask} disabled={isSubmitting}>
              {isSubmitting && <Loader2 size={16} className="mr-2 animate-spin" />}
              Adicionar ao Backlog
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
