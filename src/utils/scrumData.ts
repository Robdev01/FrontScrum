
import { ScrumData } from '../context/ScrumContext';

export const initialScrumData: ScrumData = {
  projectName: 'Exemplo de Projeto Scrum',
  currentRole: 'developer',
  showTutorial: true,
  productBacklog: [
    {
      id: 'task-1',
      title: 'Implementar login de usuário',
      description: 'Criar tela de login com validação de formulário',
      assignee: 'Maria Silva',
      storyPoints: 5,
      status: 'product-backlog'
    },
    {
      id: 'task-2',
      title: 'Desenvolver página de perfil',
      description: 'Criar página com informações do usuário e opções de edição',
      assignee: '',
      storyPoints: 3,
      status: 'product-backlog'
    },
    {
      id: 'task-3',
      title: 'Implementar recuperação de senha',
      description: 'Permitir que usuários recuperem senha via e-mail',
      assignee: '',
      storyPoints: 3,
      status: 'product-backlog'
    },
    {
      id: 'task-4',
      title: 'Integração com API de pagamentos',
      description: 'Conectar com gateway de pagamentos para processamento de transações',
      assignee: '',
      storyPoints: 8,
      status: 'product-backlog'
    },
    {
      id: 'task-5',
      title: 'Design do dashboard principal',
      description: 'Criar layout do painel principal com widgets personalizáveis',
      assignee: '',
      storyPoints: 5,
      status: 'product-backlog'
    }
  ],
  sprints: [
    {
      id: 'sprint-1',
      name: 'Sprint 1',
      goal: 'Implementar funcionalidades básicas de autenticação',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      completed: false,
      dailyNotes: {
        [new Date().toISOString().split('T')[0]]: 'Início da Sprint. Discussão sobre o escopo.'
      },
      tasks: [
        {
          id: 'task-6',
          title: 'Configurar ambiente de desenvolvimento',
          description: 'Preparar ambiente com dependências e ferramentas necessárias',
          assignee: 'João Pereira',
          storyPoints: 2,
          status: 'todo'
        },
        {
          id: 'task-7',
          title: 'Criar componente de botão reutilizável',
          description: 'Desenvolver componente de botão com variações',
          assignee: 'Ana Costa',
          storyPoints: 1,
          status: 'doing'
        },
        {
          id: 'task-8',
          title: 'Implementar validação de formulários',
          description: 'Criar utilitários para validação de inputs',
          assignee: 'Pedro Santos',
          storyPoints: 3,
          status: 'done'
        }
      ]
    }
  ]
};

export const teamMembers = [
  'Robson Calheira',
  'Lucas Pereira'
];

export const roleDescriptions = {
  'product-owner': 'O Product Owner é responsável por maximizar o valor do produto. Gerencia o Product Backlog e garante que todos entendam as prioridades.',
  'scrum-master': 'O Scrum Master facilita eventos Scrum e remove impedimentos da equipe. Ajuda todos a entender a teoria, práticas e regras do Scrum.',
  'developer': 'O Time de Desenvolvimento é responsável por entregar incrementos "Prontos" do produto ao final de cada Sprint, trabalhando de forma auto-organizada.'
};

export const scrumCeremonies = [
  {
    name: 'Sprint Planning',
    description: 'Reunião no início da Sprint para definir o que será entregue e como será feito o trabalho.',
    participants: ['Product Owner', 'Scrum Master', 'Time de Desenvolvimento'],
    duration: 'Até 8 horas para uma Sprint de 1 mês'
  },
  {
    name: 'Daily Scrum',
    description: 'Reunião diária de 15 minutos para sincronização da equipe.',
    participants: ['Time de Desenvolvimento', 'Scrum Master (facilitador)'],
    duration: '15 minutos'
  },
  {
    name: 'Sprint Review',
    description: 'Demonstração do incremento do produto ao final da Sprint.',
    participants: ['Product Owner', 'Scrum Master', 'Time de Desenvolvimento', 'Stakeholders'],
    duration: 'Até 4 horas para uma Sprint de 1 mês'
  },
  {
    name: 'Sprint Retrospective',
    description: 'Reflexão sobre a Sprint para identificar melhorias no processo.',
    participants: ['Product Owner', 'Scrum Master', 'Time de Desenvolvimento'],
    duration: 'Até 3 horas para uma Sprint de 1 mês'
  }
];
