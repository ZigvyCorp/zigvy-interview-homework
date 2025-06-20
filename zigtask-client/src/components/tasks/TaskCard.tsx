import React from 'react';
import { format } from 'date-fns';
import { Task } from '../../types/task';
import { TaskStatusBadge } from './TaskStatusBadge';
import { Button } from '../ui/Button';
import
    {
        PencilIcon,
        TrashIcon,
        CalendarIcon,
        ClockIcon
    } from '@heroicons/react/24/outline';

interface TaskCardProps
{
    task: Task;
    onEdit: ( task: Task ) => void;
    onDelete: ( taskId: string ) => void;
    onStatusChange: ( taskId: string, status: Task[ 'status' ] ) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ( {
    task,
    onEdit,
    onDelete,
    onStatusChange,
} ) =>
{
    const isDue = task.dueDate && new Date( task.dueDate ) < new Date();
    const isToday = task.dueDate &&
        format( new Date( task.dueDate ), 'yyyy-MM-dd' ) === format( new Date(), 'yyyy-MM-dd' );

    const handleStatusClick = () =>
    {
        const statusOrder: Task[ 'status' ][] = [ 'To Do', 'In Progress', 'Done' ];
        const currentIndex = statusOrder.indexOf( task.status );
        const nextIndex = ( currentIndex + 1 ) % statusOrder.length;
        onStatusChange( task.id, statusOrder[ nextIndex ] );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {task.description}
                        </p>
                    )}
                </div>

                <TaskStatusBadge
                    status={task.status}
                    onClick={handleStatusClick}
                    className="ml-2 flex-shrink-0"
                />
            </div>

            {/* Due date */}
            {task.dueDate && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>Due {format( new Date( task.dueDate ), 'MMM dd, yyyy' )}</span>
                    {isDue && <span className="ml-1 font-medium">(Overdue)</span>}
                    {isToday && <span className="ml-1 font-medium">(Today)</span>}
                </div>
            )}

            {/* Timestamps */}
            <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 mb-4">
                <ClockIcon className="h-3 w-3 mr-1" />
                <span>Created {format( new Date( task.createdAt ), 'MMM dd, yyyy' )}</span>
                {task.updatedAt !== task.createdAt && (
                    <span className="ml-2">
                        • Updated {format( new Date( task.updatedAt ), 'MMM dd, yyyy' )}
                    </span>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit( task )}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <PencilIcon className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete( task.id )}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                    <TrashIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};