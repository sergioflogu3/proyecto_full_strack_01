// Wrapper que usa el backend para todas las respuestas
export interface ApiResponse<T = unknown> {
  status: number;
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Lo que contiene data cuando el login/register es exitoso
export interface AuthPayload {
  token: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  ownerId: string;
  createdAt: string;
  _count?: { tasks: number };
  owner?: Pick<User, 'id' | 'name' | 'email'>;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  projectId: string;
  assignedTo?: string | null;
  createdAt: string;
  assignee?: Pick<User, 'id' | 'name' | 'email'> | null;
  _count?: { comments: number };
}

export interface CreateProjectData {
  name: string;
  description?: string;
  ownerId: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  projectId: string;
  status?: TaskStatus;
  assignedTo?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignedTo?: string | null;
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  createdAt: string;
  user?: Pick<User, 'id' | 'name' | 'email'>;
}

export interface CreateCommentData {
  content: string;
  taskId: string;
}
