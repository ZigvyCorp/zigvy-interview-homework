import React from 'react';
import { TaskFilters, TaskStatus } from '../../types/task';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TaskFiltersProps
{
    filters: TaskFilters;
    onFiltersChange: ( filters: TaskFilters ) => void;
    taskCounts: {
        total: number;
        todo: number;
        inProgress: number;
        done: number;
    };
}

const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'To Do', label: 'To Do' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Done', label: 'Done' },
];

export const TaskFiltersComponent: React.FC<TaskFiltersProps> = ( {
    filters,
    onFiltersChange,
    taskCounts
} ) => 
{
    const handleSearchChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
    {
        onFiltersChange( {
            ...filters,
            search: e.target.value || undefined,
        } );
    };

    const handleStatusChange = ( e: React.ChangeEvent<HTMLSelectElement> ) =>
    {
        onFiltersChange( {
            ...filters,
            status: ( e.target.value as TaskStatus ) || undefined,
        } );
    };

    const handleDateFromChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
    {
        onFiltersChange( {
            ...filters,
            dueDateFrom: e.target.value || undefined,
        } );
    };

    const handleDateToChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
    {
        onFiltersChange( {
            ...filters,
            dueDateTo: e.target.value || undefined,
        } );
    };

    const clearFilters = () =>
    {
        onFiltersChange( {} );
    };

    const hasActiveFilters = Boolean(
        filters.search || filters.status || filters.dueDateFrom || filters.dueDateTo
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            {/* Search and Status Filter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Search tasks..."
                        value={filters.search || ''}
                        onChange={handleSearchChange}
                        className="pl-10"
                    />
                </div>

                <Select
                    value={filters.status || ''}
                    onChange={handleStatusChange}
                    options={statusOptions}
                    placeholder="Filter by status"
                />

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        onClick={clearFilters}
                        className="flex items-center justify-center"
                    >
                        <XMarkIcon className="h-4 w-4 mr-2" />
                        Clear Filters
                    </Button>
                )}
            </div>

            {/* Date Range Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                    type="date"
                    label="Due Date From"
                    value={filters.dueDateFrom || ''}
                    onChange={handleDateFromChange}
                />

                <Input
                    type="date"
                    label="Due Date To"
                    value={filters.dueDateTo || ''}
                    onChange={handleDateToChange}
                />
            </div>

            {/* Task Counts */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                <span className="flex items-center">
                    <span className="font-medium text-gray-900 dark:text-white mr-1">
                        {taskCounts.total}
                    </span>
                    Total
                </span>

                <span className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    <span className="font-medium mr-1">{taskCounts.todo}</span>
                    To Do
                </span>

                <span className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    <span className="font-medium mr-1">{taskCounts.inProgress}</span>
                    In Progress
                </span>

                <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    <span className="font-medium mr-1">{taskCounts.done}</span>
                    Done
                </span>
            </div>
        </div>
    );
};