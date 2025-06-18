import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { TasksState, Task, CreateTaskData, UpdateTaskData, FilterTaskData } from '../types';
import { TaskStatus } from '../types';
import { tasksApi } from '../utils/api';

const initialState: TasksState = {
  tasks: [],
  groupedTasks: {
    [TaskStatus.TODO]: [],
    [TaskStatus.IN_PROGRESS]: [],
    [TaskStatus.DONE]: [],
  },
  loading: false,
  error: null,
};

// Helper function to group tasks by status
const groupTasksByStatus = (tasks: Task[]) => {
  return tasks.reduce((acc, task) => {
    acc[task.status] = acc[task.status] || [];
    acc[task.status].push(task);
    return acc;
  }, {
    [TaskStatus.TODO]: [],
    [TaskStatus.IN_PROGRESS]: [],
    [TaskStatus.DONE]: [],
  } as Record<TaskStatus, Task[]>);
};

// Async thunks
export const fetchTasksGrouped = createAsyncThunk(
  'tasks/fetchGrouped',
  async (filters: FilterTaskData | undefined = undefined, { rejectWithValue }) => {
    try {
      let response;
      if (filters && (filters.title || filters.from || filters.to)) {
        response = await tasksApi.search(filters);
      } else {
        response = await tasksApi.getGrouped();
      }
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tasks';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (data: CreateTaskData, { rejectWithValue }) => {
    try {
      const response = await tasksApi.create(data);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, data }: { id: string; data: UpdateTaskData }, { rejectWithValue }) => {
    try {
      const response = await tasksApi.update(id, data);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update task';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await tasksApi.delete(id);
      return id;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete task';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  async ({ id, status }: { id: string; status: TaskStatus }, { rejectWithValue }) => {
    try {
      const response = await tasksApi.updateStatus(id, status);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update task status';
      return rejectWithValue(errorMessage);
    }
  }
);

export const searchTasks = createAsyncThunk(
  'tasks/search',
  async (filters: FilterTaskData, { rejectWithValue }) => {
    try {
      const response = await tasksApi.search(filters);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search tasks';
      return rejectWithValue(errorMessage);
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // For optimistic drag and drop updates
    reorderTasks: (state, action: { payload: { sourceStatus: TaskStatus; destStatus: TaskStatus; sourceIndex: number; destIndex: number } }) => {
      const { sourceStatus, destStatus, sourceIndex, destIndex } = action.payload;
      
      if (sourceStatus === destStatus) {
        // Reordering within the same column
        const column = state.groupedTasks[sourceStatus];
        const [movedTask] = column.splice(sourceIndex, 1);
        column.splice(destIndex, 0, movedTask);
      } else {
        // Moving between columns
        const sourceColumn = state.groupedTasks[sourceStatus];
        const destColumn = state.groupedTasks[destStatus];
        const [movedTask] = sourceColumn.splice(sourceIndex, 1);
        movedTask.status = destStatus;
        destColumn.splice(destIndex, 0, movedTask);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks grouped
      .addCase(fetchTasksGrouped.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksGrouped.fulfilled, (state, action) => {
        state.loading = false;
        state.groupedTasks = action.payload as Record<TaskStatus, Task[]>;
        // Flatten for tasks array
        state.tasks = Object.values(action.payload as Record<TaskStatus, Task[]>).flat();
      })
      .addCase(fetchTasksGrouped.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        const newTask = action.payload as Task;
        state.tasks.push(newTask);
        state.groupedTasks[newTask.status].push(newTask);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const updatedTask = action.payload as Task;
        const index = state.tasks.findIndex(task => task._id === updatedTask._id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
          state.groupedTasks = groupTasksByStatus(state.tasks);
        }
      })
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        const taskId = action.payload;
        state.tasks = state.tasks.filter(task => task._id !== taskId);
        state.groupedTasks = groupTasksByStatus(state.tasks);
      })
      // Update task status
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const updatedTask = action.payload as Task;
        const index = state.tasks.findIndex(task => task._id === updatedTask._id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
          state.groupedTasks = groupTasksByStatus(state.tasks);
        }
      })
      // Search tasks
      .addCase(searchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload as Task[];
        state.groupedTasks = groupTasksByStatus(action.payload as Task[]);
      });
  },
});

export const { clearError, reorderTasks } = tasksSlice.actions;
export default tasksSlice.reducer; 