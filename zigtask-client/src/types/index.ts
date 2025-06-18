// Types definitions for the application
export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  email: string;
  fullName: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface TasksState {
  tasks: Task[];
  groupedTasks: Record<TaskStatus, Task[]>;
  loading: boolean;
  error: string | null;
}

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  dueDate: string;
  status?: TaskStatus;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: TaskStatus;
}

export interface FilterTaskData {
  title?: string;
  from?: string;
  to?: string;
} 