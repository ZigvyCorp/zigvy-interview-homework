import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form'; // Import SubmitHandler
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Task, CreateTaskRequest, TaskStatus } from '../../types/task';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { format } from 'date-fns';

export const taskSchema = yup.object({
  title: yup.string().required('Title is required').max(100, 'Title must be less than 100 characters'),
  description: yup.string().max(500, 'Description must be less than 500 characters').optional().nullable(),
  status: yup
    .mixed<TaskStatus>()
    .oneOf(['To Do', 'In Progress', 'Done'] as const, 'Invalid status')
    .required('Status is required'),
  dueDate: yup.string().nullable().optional(),
});

interface TaskFormProps {
  onSubmit: (data: CreateTaskRequest) => Promise<void>;
  onCancel: () => void;
  task?: Task | null;
  isLoading?: boolean;
}

const statusOptions = [
  { value: 'To Do', label: 'To Do' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Done', label: 'Done' },
];

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel, task, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTaskRequest>({
    resolver: yupResolver(taskSchema) as any, // Ép kiểu để giải quyết lỗi type mismatch
    defaultValues: {
      title: '',
      description: undefined,
      status: 'todo' as TaskStatus,
      dueDate: undefined,
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || undefined,
        status: task.status,
        dueDate: task.dueDate || undefined,
      });
    } else {
      reset({
        title: '',
        description: undefined,
        status: 'todo' as TaskStatus,
        dueDate: undefined,
      });
    }
  }, [task, reset]);

  const handleFormSubmit: SubmitHandler<CreateTaskRequest> = async (data) => {
    try {
      const submitData = {
        ...data,
        dueDate: data.dueDate || undefined,
      };
      await onSubmit(submitData);
    } catch (error) {
      // Error is handled by parent component
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        {...register('title')}
        label="Title"
        placeholder="Enter task title"
        error={errors.title?.message}
        autoFocus
      />

      <Textarea
        {...register('description')}
        label="Description (Optional)"
        placeholder="Add a description for your task"
        error={errors.description?.message}
        rows={3}
      />

      <Select
        {...register('status')}
        label="Status"
        options={statusOptions}
        error={errors.status?.message}
      />

      <Input
        {...register('dueDate')}
        type="date"
        label="Due Date (Optional)"
        error={errors.dueDate?.message}
      />

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>

        <Button type="submit" loading={isLoading} disabled={isLoading}>
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};