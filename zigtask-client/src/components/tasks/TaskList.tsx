import React from 'react';
import { Task } from '../../types/task';
import { TaskCard } from './TaskCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface TaskListProps
{
    tasks: Task[];
    isLoading: boolean;
    onEdit: ( task: Task ) => void;
    onDelete: ( taskId: string ) => void;
    onStatusChange: ( taskId: string, status: Task[ 'status' ] ) => void;
    emptyMessage?: string;
}

export const TaskList: React.FC<TaskListProps> = ( {
    tasks,
    isLoading,
    onEdit,
    onDelete,
    onStatusChange,
    emptyMessage = 'No tasks found.',
} ) =>
{
    if ( isLoading )
    {
        return (
            <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if ( tasks.length === 0 )
    {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500">
                    <svg
                        className="mx-auto h-12 w-12 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {emptyMessage}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get started by creating your first task.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map( ( task ) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                />
            ) )}
        </div>
    );
};