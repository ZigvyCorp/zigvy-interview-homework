import { apiService } from './api';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilters } from '../types/task';

export const taskService = {
    async getTasks ( filters?: TaskFilters ): Promise<Task[]>
    {
        const params = new URLSearchParams();

        if ( filters?.search ) params.append( 'title', filters.search );
        if ( filters?.status ) params.append( 'status', filters.status );
        if ( filters?.dueDateFrom ) params.append( 'from', filters.dueDateFrom );
        if ( filters?.dueDateTo ) params.append( 'to', filters.dueDateTo );

        const queryString = params.toString();
        const url = queryString ? `/tasks?${ queryString }` : '/tasks';

        const response = await apiService.get<Task[]>( url );
        return response;
    },

    async getTask ( id: string ): Promise<Task>
    {
        const response = await apiService.get<Task>( `/tasks/${ id }` );
        return response;
    },

    async createTask ( task: CreateTaskRequest ): Promise<Task>
    {
        const response = await apiService.post<Task>( '/tasks', task );
        return response;
    },

    async updateTask ( task: UpdateTaskRequest ): Promise<Task>
    {
        const { id, ...updateData } = task;
        const response = await apiService.put<Task>( `/tasks/${ id }`, updateData );
        return response;
    },

    async deleteTask ( id: string ): Promise<void>
    {
        await apiService.delete( `/tasks/${ id }` );
    },
};