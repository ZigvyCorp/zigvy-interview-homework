import React from 'react';

interface TaskStatsProps
{
    total: number;
    todo: number;
    inProgress: number;
    done: number;
}

export const TaskStats: React.FC<TaskStatsProps> = ( {
    total,
    todo,
    inProgress,
    done,
} ) =>
{
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{total}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">To Do</h3>
                <p className="mt-1 text-2xl font-semibold text-blue-600">{todo}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
                <p className="mt-1 text-2xl font-semibold text-yellow-600">{inProgress}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Done</h3>
                <p className="mt-1 text-2xl font-semibold text-green-600">{done}</p>
            </div>
        </div>
    );
};

export default TaskStats;