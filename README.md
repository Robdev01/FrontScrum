#  Scrum Task Manager - Frontend React + API Flask

Este projeto é uma aplicação de gerenciamento de tarefas estilo Scrum, com frontend em React + TypeScript e backend em Flask. A versão atual utiliza uma API real para persistência dos dados, substituindo o armazenamento local (`localStorage`).

##  Funcionalidades

- Autenticação de usuários (login e registro)
- Visualização e gerenciamento do Product Backlog
- Sprints com tarefas em diferentes estados: `todo`, `doing`, `done`
- Criação, atualização e exclusão de tarefas
- Integração completa com API Flask
- Feedback visual com spinners, estados de loading e notificações (toasts)

##  Tecnologias Utilizadas

### Frontend
- React
- TypeScript
- Context API
- Toast Notifications (ex: `react-toastify` ou similar)
- Hooks (`useEffect`, `useContext`, etc.)

### Backend (Repositório separado)
- Flask
- SQLite


---

##  Estrutura de Diretórios Relevante

```bash
src/
├── components/
│   └── ProductBacklog.tsx
├── context/
│   └── ScrumContext.tsx
├── pages/
│   └── Login.tsx
├── services/
│   └── api.ts
 Integração com a API
A comunicação com o backend Flask está centralizada no serviço ApiService.

Endpoints utilizados:
POST /login - Autenticação de usuários

POST /register - Registro de novos usuários

GET /tasks - Lista todas as tarefas

POST /tasks - Criação de tarefas

PUT /tasks/:id - Atualização de tarefas

DELETE /tasks/:id - Exclusão de tarefas

 Fluxo de Dados
text
Copiar
Editar
Usuário → Componentes → Contexto (ScrumContext) → ApiService → API Flask → Banco de Dados
             ↑                       ↓
            UI ← Atualização automática via loadTasksFromApi()
Exemplo:

Usuário adiciona uma tarefa

ApiService envia POST /tasks para API

API armazena no banco e retorna status

Contexto recarrega as tarefas da API

UI atualiza automaticamente

 Destaques da Implementação
 Sincronização automática: após qualquer operação de criação, atualização ou exclusão, as tarefas são recarregadas da API

 Sessão persistente: token salvo no localStorage

 Conversão de dados: os dados da API são adaptados para o modelo interno do frontend

 UX aprimorada: spinners, botões desabilitados durante requisições, mensagens de erro/sucesso

 Separação de responsabilidades: API isolada, contexto de estado global e componentes modulares

 Como Rodar Localmente
Clone este repositório:

bash
Copiar
Editar
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
Instale as dependências:

bash
Copiar
Editar
npm install
Inicie o servidor Flask separadamente (verifique a URL no api.ts):

bash
Copiar
Editar
python app.py  # ou conforme o script definido
Rode a aplicação React:

bash
Copiar
Editar
npm run dev
 To-Do / Melhorias Futuras
Implementar autenticação via JWT no frontend (se ainda não estiver finalizado)

Adicionar testes unitários e de integração

Melhorar a gestão de sprints (data de início/fim)

Dark mode 

 Licença
Este projeto está sob a licença MIT.

 Autor
Desenvolvido por Robson Calheira — sugestões, PRs e feedbacks são bem-vindos!

