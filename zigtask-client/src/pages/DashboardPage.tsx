import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { TaskList } from '../components/tasks/TaskList';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskFiltersComponent } from '../components/tasks/TaskFilters';
import { TaskStats } from '../components/tasks/TaskStats';
import { TaskForm } from '../components/tasks/TaskForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { useTaskStore } from '../store/taskStore';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../hooks/useToast';
import { Task, CreateTaskRequest } from '../types/task';
import { PlusIcon } from '@heroicons/react/24/outline';

const DashboardPage: React.FC = () =>
{
    const {
        tasks,
        isLoading,
        filters,
        getTasks,
        createTask,
        updateTask,
        deleteTask,
        updateTaskOptimistic,
        setFilters,
        getFilteredTasks,
        clearError,
    } = useTaskStore();

    const { toast } = useToast();
    const [ showTaskForm, setShowTaskForm ] = useState( false );
    const [ editingTask, setEditingTask ] = useState<Task | null>( null );
    const [ showDeleteConfirm, setShowDeleteConfirm ] = useState<string | null>( null );

    // Load tasks on component mount, chỉ khi đã xác thực
    const { isAuthenticated } = useAuthStore();
    useEffect(() => {
        if (isAuthenticated) {
            getTasks();
        }
    }, [getTasks, isAuthenticated]);

    // Get filtered tasks
    const filteredTasks = getFilteredTasks();

    // Drag-and-drop columns
    const columns = [
        { id: 'To Do', title: 'To Do', tasks: filteredTasks.filter(t => t.status === 'To Do') },
        { id: 'In Progress', title: 'In Progress', tasks: filteredTasks.filter(t => t.status === 'In Progress') },
        { id: 'Done', title: 'Done', tasks: filteredTasks.filter(t => t.status === 'Done') },
    ];

    const onDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId) return; // Không đổi cột thì thôi
        const newStatus = destination.droppableId as Task['status'];
        updateTaskOptimistic(draggableId, { status: newStatus });
        updateTask({ id: draggableId, status: newStatus }); // Gọi API thật
    };

    // Calculate task counts for filters
    const taskCounts = {
        total: tasks.length,
        todo: tasks.filter( task => task.status === 'To Do' ).length,
        inProgress: tasks.filter( task => task.status === 'In Progress' ).length,
        done: tasks.filter( task => task.status === 'Done' ).length,
    };

    const handleCreateTask = () =>
    {
        setEditingTask( null );
        setShowTaskForm( true );
    };

    const handleEditTask = ( task: Task ) =>
    {
        setEditingTask( task );
        setShowTaskForm( true );
    };

    const handleFormSubmit = async ( data: CreateTaskRequest ) =>
    {
        try
        {
            if ( editingTask )
            {
                await updateTask( { ...data, id: editingTask.id } );
                toast.success( 'Task Updated', 'Your task has been updated successfully.' );
            } else
            {
                await createTask( data );
                toast.success( 'Task Created', 'Your new task has been created successfully.' );
            }
            setShowTaskForm( false );
            setEditingTask( null );
        } catch ( error: any )
        {
            const message = ( error instanceof Error ) ? error.message : String( error );
            toast.error(
                editingTask ? 'Update Failed' : 'Creation Failed',
                message || 'Please try again.'
            );
        }
    };

    const handleFormCancel = () =>
    {
        setShowTaskForm( false );
        setEditingTask( null );
        clearError();
    };

    const handleStatusChange = async ( taskId: string, status: Task[ 'status' ] ) =>
    {
        try
        {
            // Optimistic update
            updateTaskOptimistic( taskId, { status } );

            await updateTask( { id: taskId, status } );
            toast.success( 'Status Updated', `Task moved to ${ status.replace( '-', ' ' ) }.` );
        } catch ( error: any )
        {
            toast.error( 'Update Failed', error.message || 'Please try again.' );
        }
    };

    const handleDeleteTask = ( taskId: string ) =>
    {
        setShowDeleteConfirm( taskId );
    };

    const confirmDelete = async () =>
    {
        if ( !showDeleteConfirm ) return;

        try
        {
            await deleteTask( showDeleteConfirm );
            toast.success( 'Task Deleted', 'The task has been deleted successfully.' );
            setShowDeleteConfirm( null );
        } catch ( error: any )
        {
            toast.error( 'Delete Failed', error.message || 'Please try again.' );
        }
    };

    const cancelDelete = () =>
    {
        setShowDeleteConfirm( null );
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            My Tasks
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Manage your tasks and stay organized
                        </p>
                    </div>

                    <Button
                        onClick={handleCreateTask}
                        className="mt-4 sm:mt-0"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        New Task
                    </Button>
                </div>

                {/* Task Statistics */}
                <TaskStats
                    total={tasks.length}
                    todo={tasks.filter( t => t.status === 'To Do' ).length}
                    inProgress={tasks.filter( t => t.status === 'In Progress' ).length}
                    done={tasks.filter( t => t.status === 'Done' ).length}
                />

                {/* Task Filters */}
                <TaskFiltersComponent
                    filters={filters}
                    onFiltersChange={setFilters}
                    taskCounts={taskCounts}
                />

                {/* Drag-and-drop Task Board */}
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid gap-4 md:grid-cols-3">
                        {columns.map((col) => (
                            <Droppable droppableId={col.id} key={col.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`bg-gray-50 dark:bg-gray-900 rounded-lg p-2 min-h-[200px] border border-gray-200 dark:border-gray-700 transition-shadow ${snapshot.isDraggingOver ? 'shadow-lg ring-2 ring-primary-500' : ''}`}
                                    >
                                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 text-center">{col.title}</h2>
                                        {isLoading ? (
                                            <div className="flex justify-center py-8"><span>Loading...</span></div>
                                        ) : col.tasks.length === 0 ? (
                                            <div className="text-center text-gray-400 dark:text-gray-500 py-8 text-sm">No tasks</div>
                                        ) : (
                                            col.tasks.map((task, idx) => (
                                                <Draggable draggableId={task.id} index={idx} key={task.id}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`mb-3 ${snapshot.isDragging ? 'opacity-80' : ''}`}
                                                        >
                                                            <TaskCard
                                                                task={task}
                                                                onEdit={handleEditTask}
                                                                onDelete={handleDeleteTask}
                                                                onStatusChange={handleStatusChange}
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>

                {/* Task Form Modal */}
                <Modal
                    isOpen={showTaskForm}
                    onClose={handleFormCancel}
                    title={editingTask ? 'Edit Task' : 'Create New Task'}
                    size="md"
                >
                    <div className="p-6">
                        <TaskForm
                            task={editingTask || undefined}
                            onSubmit={handleFormSubmit}
                            onCancel={handleFormCancel}
                            isLoading={isLoading}
                        />
                    </div>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal
                    isOpen={!!showDeleteConfirm}
                    onClose={cancelDelete}
                    title="Delete Task"
                    size="sm"
                >
                    <div className="p-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Are you sure you want to delete this task? This action cannot be undone.
                        </p>

                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="secondary"
                                onClick={cancelDelete}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="danger"
                                onClick={confirmDelete}
                                loading={isLoading}
                            >
                                Delete Task
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </DashboardLayout>
    );
};
export default DashboardPage;