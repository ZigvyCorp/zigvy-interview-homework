export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface Task
{
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
}

export interface CreateTaskRequest
{
    title: string;
    description?: string;
    status?: TaskStatus;
    dueDate?: string;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest>
{
    id: string;
}

export interface TaskFilters
{
    search?: string;
    status?: TaskStatus;
    dueDateFrom?: string;
    dueDateTo?: string;
}