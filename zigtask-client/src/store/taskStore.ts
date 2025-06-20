import { create } from 'zustand';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilters, TaskStatus } from '../types/task';
import { taskService } from '../services/taskService';

interface TaskState
{
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    filters: TaskFilters;

    // Actions
    getTasks: () => Promise<void>;
    createTask: ( task: CreateTaskRequest ) => Promise<void>;
    updateTask: ( task: UpdateTaskRequest ) => Promise<void>;
    deleteTask: ( id: string ) => Promise<void>;
    updateTaskOptimistic: ( id: string, updates: Partial<Task> ) => void;
    setFilters: ( filters: TaskFilters ) => void;
    clearError: () => void;

    // Computed
    getTasksByStatus: ( status: TaskStatus ) => Task[];
    getFilteredTasks: () => Task[];
}

export const useTaskStore = create<TaskState>( ( set, get ) => ( {
    tasks: [],
    isLoading: false,
    error: null,
    filters: {},

    getTasks: async () =>
    {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            // Không gọi API nếu chưa xác thực
            set({ error: 'Bạn chưa đăng nhập!', isLoading: false });
            return;
        }
        try
        {
            set({ isLoading: true, error: null });
            const tasks = await taskService.getTasks(get().filters);
            set({ tasks, isLoading: false });
        } catch (error: any)
        {
            set({ error: error.message, isLoading: false });
        }
    },

    createTask: async ( taskData: CreateTaskRequest ) =>
    {
        try
        {
            const newTask = await taskService.createTask( taskData );
            set( ( state ) => ( {
                tasks: [ ...state.tasks, newTask ],
            } ) );
        } catch ( error: any )
        {
            set( { error: error.message } );
            throw error;
        }
    },

    updateTask: async ( taskData: UpdateTaskRequest ) =>
    {
        try
        {
            const updatedTask = await taskService.updateTask( taskData );
            set( ( state ) => ( {
                tasks: state.tasks.map( ( task ) =>
                    task.id === updatedTask.id ? updatedTask : task
                ),
            } ) );
        } catch ( error: any )
        {
            // Revert optimistic update on error
            get().getTasks();
            set( { error: error.message } );
            throw error;
        }
    },

    deleteTask: async ( id: string ) =>
    {
        try
        {
            await taskService.deleteTask( id );
            set( ( state ) => ( {
                tasks: state.tasks.filter( ( task ) => task.id !== id ),
            } ) );
        } catch ( error: any )
        {
            set( { error: error.message } );
            throw error;
        }
    },

    updateTaskOptimistic: ( id: string, updates: Partial<Task> ) =>
    {
        set( ( state ) => ( {
            tasks: state.tasks.map( ( task ) =>
                task.id === id ? { ...task, ...updates } : task
            ),
        } ) );
    },

    setFilters: ( filters: TaskFilters ) =>
    {
        set( { filters } );
        get().getTasks();
    },

    clearError: () => set( { error: null } ),

    getTasksByStatus: ( status: TaskStatus ) =>
    {
        return get().tasks.filter( ( task ) => task.status === status );
    },

    getFilteredTasks: () =>
    {
        const { tasks, filters } = get();

        return tasks.filter( ( task ) =>
        {
            if ( filters.search && !task.title.toLowerCase().includes( filters.search.toLowerCase() ) )
            {
                return false;
            }

            if ( filters.status && task.status !== filters.status )
            {
                return false;
            }

            if ( filters.dueDateFrom && task.dueDate && task.dueDate < filters.dueDateFrom )
            {
                return false;
            }

            if ( filters.dueDateTo && task.dueDate && task.dueDate > filters.dueDateTo )
            {
                return false;
            }

            return true;
        } );
    },
} ) );