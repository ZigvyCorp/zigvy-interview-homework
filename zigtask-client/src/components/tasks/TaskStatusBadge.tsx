import React from 'react';
import { TaskStatus } from '../../types/task';

interface TaskStatusBadgeProps
{
    status: TaskStatus;
    onClick?: () => void;
    className?: string;
}

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ( {
    status,
    onClick,
    className = ''
} ) =>
{
    const getStatusConfig = ( status: TaskStatus ) =>
    {
        switch ( status )
        {
            case 'To Do':
                return {
                    label: 'To Do',
                    className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
                };
            case 'In Progress':
                return {
                    label: 'In Progress',
                    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
                };
            case 'Done':
                return {
                    label: 'Done',
                    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                };
            default:
                return {
                    label: 'Unknown',
                    className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
                };
        }
    };

    const config = getStatusConfig( status );
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors';
    const clickableClasses = onClick ? 'cursor-pointer hover:opacity-80' : '';

    return (
        <span
            className={`${ baseClasses } ${ config.className } ${ clickableClasses } ${ className }`}
            onClick={onClick}
        >
            {config.label}
        </span>
    );
};