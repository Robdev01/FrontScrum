
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task, useScrumContext } from '../context/ScrumContext';
import { teamMembers } from '../utils/scrumData';
import { Edit } from 'lucide-react';

interface DraggableCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const DraggableCard: React.FC<DraggableCardProps> = ({ 
  task, 
  onDragStart, 
  onDragEnd 
}) => {
  const { currentRole, updateTask } = useScrumContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({...task});

  const handleEditTask = () => {
    updateTask(editedTask);
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'product-backlog':
        return 'bg-scrum-product-backlog text-white';
      case 'sprint-backlog':
        return 'bg-scrum-sprint-backlog text-white';
      case 'todo':
        return 'bg-scrum-todo text-primary';
      case 'doing':
        return 'bg-scrum-doing text-primary';
      case 'done':
        return 'bg-scrum-done text-primary';
      default:
        return 'bg-muted';
    }
  };

  // Determine if user can edit based on role
  const canEdit = 
    (currentRole === 'product-owner' && task.status === 'product-backlog') || 
    (currentRole === 'scrum-master') ||
    (currentRole === 'developer' && ['todo', 'doing', 'done'].includes(task.status));

  const statusLabel = {
    'product-backlog': 'Backlog',
    'sprint-backlog': 'Sprint Backlog',
    'todo': 'A Fazer',
    'doing': 'Em Progresso',
    'done': 'Concluído'
  };

  return (
    <>
      <div 
        draggable 
        onDragStart={(e) => onDragStart(e, task.id)} 
        onDragEnd={onDragEnd}
        className="drag-card animate-card-slide"
      >
        <Card className="cursor-grab active:cursor-grabbing border-l-4 shadow-sm hover:shadow transition-all hover:-translate-y-1">
          <CardHeader className="pb-2 relative">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">{task.title}</CardTitle>
              {canEdit && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 rounded-full"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit size={14} />
                </Button>
              )}
            </div>
            <CardDescription className="text-xs truncate max-w-[250px]">
              {task.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-wrap gap-1 mt-1">
              <Badge variant="outline" className={getStatusColor(task.status)}>
                {statusLabel[task.status as keyof typeof statusLabel]}
              </Badge>
              <Badge variant="outline" className="bg-accent">
                {task.storyPoints} {task.storyPoints === 1 ? 'ponto' : 'pontos'}
              </Badge>
            </div>
          </CardContent>
          {task.assignee && (
            <CardFooter className="pt-0 pb-2">
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Responsável:</span> {task.assignee}
              </div>
            </CardFooter>
          )}
        </Card>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Tarefa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input 
                id="title" 
                value={editedTask.title} 
                onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description" 
                value={editedTask.description}
                rows={3}
                onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignee">Responsável</Label>
                <Select 
                  value={editedTask.assignee || ""} 
                  onValueChange={(value) => setEditedTask({...editedTask, assignee: value})}
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
                  value={editedTask.storyPoints.toString()} 
                  onValueChange={(value) => setEditedTask({...editedTask, storyPoints: parseInt(value)})}
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
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditTask}>
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
