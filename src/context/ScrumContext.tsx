import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/localStorage';
import { initialScrumData } from '../utils/scrumData';
import { apiService, ApiTask, TaskRequest } from '../services/api';
import { useToast } from "@/hooks/use-toast";

export type ScrumRole = 'product-owner' | 'scrum-master' | 'developer';

export type TaskStatus = 'product-backlog' | 'sprint-backlog' | 'todo' | 'doing' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  storyPoints: number;
  status: TaskStatus;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
  isActive: boolean;
  completed: boolean;
  dailyNotes: Record<string, string>;
}

export interface ScrumData {
  projectName: string;
  productBacklog: Task[];
  sprints: Sprint[];
  currentRole: ScrumRole;
  showTutorial: boolean;
}

interface ScrumContextType {
  scrumData: ScrumData;
  currentRole: ScrumRole;
  isLoading: boolean;
  setCurrentRole: (role: ScrumRole) => void;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  moveTask: (taskId: string, newStatus: TaskStatus, sprintId?: string) => Promise<void>;
  addSprint: (sprint: Omit<Sprint, 'id'>) => void;
  updateSprint: (sprint: Sprint) => void;
  deleteSprint: (sprintId: string) => void;
  toggleTutorial: () => void;
  resetData: () => void;
  loadTasksFromApi: () => Promise<void>;
}

const ScrumContext = createContext<ScrumContextType | undefined>(undefined);

export const ScrumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scrumData, setScrumData] = useState<ScrumData>(() => {
    const savedData = loadData('scrumData');
    return savedData || initialScrumData;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    saveData('scrumData', scrumData);
  }, [scrumData]);

  const convertApiTaskToTask = (apiTask: ApiTask): Task => {
    return {
      id: apiTask.id.toString(),
      title: apiTask.title,
      description: apiTask.description,
      assignee: apiTask.assignee,
      storyPoints: apiTask.storyPoints,
      status: apiTask.status as TaskStatus
    };
  };

  const loadTasksFromApi = async () => {
    try {
      setIsLoading(true);
      const apiTasks = await apiService.getTasks();
      const tasks = apiTasks.map(convertApiTaskToTask);
      
      setScrumData(prev => ({
        ...prev,
        productBacklog: tasks.filter(task => task.status === 'product-backlog'),
        sprints: prev.sprints.map(sprint => ({
          ...sprint,
          tasks: tasks.filter(task => 
            ['todo', 'doing', 'done'].includes(task.status) && 
            sprint.isActive
          )
        }))
      }));
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasksFromApi();
  }, []);

  const setCurrentRole = (role: ScrumRole) => {
    setScrumData(prev => ({ ...prev, currentRole: role }));
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      setIsLoading(true);
      const taskRequest: TaskRequest = {
        title: task.title,
        description: task.description,
        assignee: task.assignee,
        storyPoints: task.storyPoints,
        status: task.status
      };

      await apiService.createTask(taskRequest);
      await loadTasksFromApi(); // Recarrega as tarefas da API
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (task: Task) => {
    try {
      setIsLoading(true);
      const taskRequest: TaskRequest = {
        title: task.title,
        description: task.description,
        assignee: task.assignee,
        storyPoints: task.storyPoints,
        status: task.status
      };

      await apiService.updateTask(parseInt(task.id), taskRequest);
      await loadTasksFromApi(); // Recarrega as tarefas da API
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      setIsLoading(true);
      await apiService.deleteTask(parseInt(taskId));
      await loadTasksFromApi(); // Recarrega as tarefas da API
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const moveTask = async (taskId: string, newStatus: TaskStatus, sprintId?: string) => {
    try {
      setIsLoading(true);
      // Encontra a tarefa atual
      let currentTask: Task | undefined;
      
      // Procura na productBacklog
      currentTask = scrumData.productBacklog.find(t => t.id === taskId);
      
      // Se não encontrou, procura nas sprints
      if (!currentTask) {
        for (const sprint of scrumData.sprints) {
          currentTask = sprint.tasks.find(t => t.id === taskId);
          if (currentTask) break;
        }
      }

      if (currentTask) {
        const updatedTask = { ...currentTask, status: newStatus };
        await updateTask(updatedTask);
      }
    } catch (error) {
      console.error('Erro ao mover tarefa:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addSprint = (sprint: Omit<Sprint, 'id'>) => {
    const newSprint: Sprint = {
      ...sprint,
      id: `sprint-${Date.now()}`,
    };
    
    // Deactivate other sprints if this one is active
    const updatedSprints = newSprint.isActive 
      ? scrumData.sprints.map(s => ({...s, isActive: false}))
      : [...scrumData.sprints];
    
    setScrumData(prev => ({
      ...prev,
      sprints: [...updatedSprints, newSprint]
    }));
  };

  const updateSprint = (sprint: Sprint) => {
    // Deactivate other sprints if this one is being activated
    let updatedSprints = [...scrumData.sprints];
    if (sprint.isActive) {
      updatedSprints = updatedSprints.map(s => ({
        ...s,
        isActive: s.id === sprint.id
      }));
    }
    
    setScrumData(prev => ({
      ...prev,
      sprints: updatedSprints.map(s => s.id === sprint.id ? sprint : s)
    }));
  };

  const deleteSprint = (sprintId: string) => {
    setScrumData(prev => {
      const sprintToDelete = prev.sprints.find(s => s.id === sprintId);
      if (!sprintToDelete) return prev;

      // Move sprint tasks back to product backlog
      const tasksToMoveBack = sprintToDelete.tasks.map(task => ({
        ...task,
        status: 'product-backlog' as TaskStatus
      }));

      const updatedSprints = prev.sprints.filter(s => s.id !== sprintId);
      
      return {
        ...prev,
        productBacklog: [...prev.productBacklog, ...tasksToMoveBack],
        sprints: updatedSprints
      };
    });
  };

  const toggleTutorial = () => {
    setScrumData(prev => ({
      ...prev,
      showTutorial: !prev.showTutorial
    }));
  };

  const resetData = () => {
    setScrumData(initialScrumData);
  };

  return (
    <ScrumContext.Provider 
      value={{
        scrumData,
        currentRole: scrumData.currentRole,
        isLoading,
        setCurrentRole,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        addSprint,
        updateSprint,
        deleteSprint,
        toggleTutorial,
        resetData,
        loadTasksFromApi
      }}
    >
      {children}
    </ScrumContext.Provider>
  );
};

export const useScrumContext = () => {
  const context = useContext(ScrumContext);
  if (context === undefined) {
    throw new Error('useScrumContext must be used within a ScrumProvider');
  }
  return context;
};
