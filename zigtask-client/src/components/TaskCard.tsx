/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  useTheme,
} from '@mui/material';
import { Delete, CalendarToday, AccessTime, Edit } from '@mui/icons-material';
import { useAppDispatch } from '../store/hooks';
import { deleteTask } from '../store/tasksSlice';
import type { Task } from '../types';
import ConfirmDialog from './ConfirmDialog';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  dragHandleProps?: any;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, dragHandleProps }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteTask(task._id));
    setShowDeleteDialog(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const isOverdue = () => {
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < now && task.status !== 'Done';
  };



  return (
    <Card 
      {...dragHandleProps}
      sx={{ 
        mb: 2,
        minHeight: 150,
        width: '100%',
        cursor: 'grab',
        background: theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${isOverdue() ? '#ef4444' : 'rgba(255, 255, 255, 0.2)'}`,
        borderRadius: '16px',
        boxShadow: theme.palette.mode === 'dark'
          ? '0 4px 16px rgba(0, 0, 0, 0.2)'
          : '0 4px 16px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        '&:hover': { 
          transform: 'translateY(-2px)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 24px rgba(0, 0, 0, 0.3)'
            : '0 8px 24px rgba(0, 0, 0, 0.12)',
        },
        '&:active': {
          cursor: 'grabbing',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header with title and actions */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography 
            variant="h6" 
            component="h3" 
            sx={{ 
              fontSize: '1.1rem', 
              fontWeight: 700,
              color: theme.palette.text.primary,
              flex: 1,
              mr: 1,
              lineHeight: 1.3,
            }}
          >
            {task.title}
          </Typography>
          <Box display="flex" gap={0.5}>
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              sx={{
                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                color: '#0ea5e9',
                '&:hover': {
                  backgroundColor: 'rgba(14, 165, 233, 0.2)',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              sx={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Description */}
        {task.description && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              lineHeight: 1.6,
              fontSize: '0.9rem',
            }}
          >
            {task.description}
          </Typography>
        )}

        {/* Footer with date info and status */}
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
          {/* Due date */}
          <Box display="flex" alignItems="center" gap={0.5}>
            <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {formatDate(task.dueDate)}
            </Typography>
          </Box>

          {/* Created time */}
          <Box display="flex" alignItems="center" gap={0.5}>
            <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {formatTimeAgo(task.createdAt)}
            </Typography>
          </Box>
          
          {/* Status badges */}
          <Box display="flex" gap={1}>
            {isOverdue() && (
              <Chip 
                label="Overdue" 
                size="small"
                sx={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: '24px',
                }}
              />
            )}
          </Box>
        </Box>
      </CardContent>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        severity="error"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Card>
  );
};

export default TaskCard; 