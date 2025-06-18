import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  useTheme,
  Chip,
} from '@mui/material';
import { Close, Save, Add } from '@mui/icons-material';
import { useAppDispatch } from '../store/hooks';
import { createTask, updateTask } from '../store/tasksSlice';
import type { Task, CreateTaskData, UpdateTaskData } from '../types';
import { TaskStatus } from '../types';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ open, onClose, task }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: TaskStatus.TODO,
  });

  useEffect(() => {
    if (task) {
      // Format for datetime-local input (YYYY-MM-DDTHH:MM)
      const dueDate = new Date(task.dueDate);
      const formattedDate = dueDate.toISOString().slice(0, 16);
      
      setFormData({
        title: task.title,
        description: task.description || '',
        dueDate: formattedDate,
        status: task.status,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        status: TaskStatus.TODO,
      });
    }
  }, [task, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (e: { target: { value: TaskStatus } }) => {
    setFormData({
      ...formData,
      status: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (task) {
      // Update existing task
      const updateData: UpdateTaskData = {
        title: formData.title,
        description: formData.description,
        dueDate: new Date(formData.dueDate).toISOString(),
        status: formData.status,
      };
      dispatch(updateTask({ id: task._id, data: updateData }));
    } else {
      // Create new task
      const createData: CreateTaskData = {
        title: formData.title,
        description: formData.description,
        dueDate: new Date(formData.dueDate).toISOString(),
        status: formData.status,
      };
      dispatch(createTask(createData));
    }
    
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {task ? 'Edit Task' : 'Create New Task'}
      </DialogTitle>
      
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            margin="normal"
          />
          
          <TextField
            name="dueDate"
            label="Due Date & Time"
            type="datetime-local"
            value={formData.dueDate}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={handleSelectChange}
              label="Trạng thái"
            >
              {Object.values(TaskStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            {task ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default TaskForm; 