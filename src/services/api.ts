
const API_BASE_URL = 'http://127.0.0.1:8080'; // Ajuste para a URL da sua API

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

interface TaskRequest {
  title: string;
  description: string;
  assignee: string;
  storyPoints: number;
  status: string;
}

interface ApiTask {
  id: number;
  title: string;
  description: string;
  assignee: string;
  storyPoints: number;
  status: string;
}

class ApiService {
  async login(credentials: LoginRequest) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro no login');
    }

    return response.json();
  }

  async register(userData: RegisterRequest) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro no registro');
    }

    return response.json();
  }

  async getTasks(): Promise<ApiTask[]> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar tarefas');
    }

    return response.json();
  }

  async createTask(task: TaskRequest): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar tarefa');
    }

    return response.json();
  }

  async updateTask(taskId: number, task: Partial<TaskRequest>): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao atualizar tarefa');
    }

    return response.json();
  }

  async deleteTask(taskId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao deletar tarefa');
    }

    return response.json();
  }
}

export const apiService = new ApiService();
export type { ApiTask, TaskRequest, LoginRequest, RegisterRequest };
