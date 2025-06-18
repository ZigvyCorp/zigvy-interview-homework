/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Fab,
  TextField,
  InputAdornment,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  Button,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Logout,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTasksGrouped, updateTaskStatus, reorderTasks } from '../store/tasksSlice';
import { logout } from '../store/authSlice';
import { toggleTheme } from '../store/themeSlice';
import type { Task } from '../types';
import { TaskStatus } from '../types';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import AITaskSuggestions from '../components/AITaskSuggestions';

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { groupedTasks } = useAppSelector(state => state.tasks);
  const { user } = useAppSelector(state => state.auth);
  const themeState = useAppSelector(state => state.theme);
  const mode = themeState?.mode || 'light';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editingAITask, setEditingAITask] = useState<{title: string; description: string} | null>(null);
  const [dateFilters, setDateFilters] = useState({
    startDate: '',
    endDate: '',
  });
  const [debouncedFilters, setDebouncedFilters] = useState({
    searchTerm: '',
    startDate: '',
    endDate: '',
  });

  // Debounce effect for search and date filters
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters({
        searchTerm,
        startDate: dateFilters.startDate,
        endDate: dateFilters.endDate,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, dateFilters.startDate, dateFilters.endDate]);

  // Fetch tasks initially
  useEffect(() => {
    dispatch(fetchTasksGrouped());
  }, [dispatch]);

  const handleDragEnd = (result: { destination: any; source: any; draggableId: string }) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceStatus = source.droppableId as TaskStatus;
    const destStatus = destination.droppableId as TaskStatus;

    // Optimistic update
    dispatch(reorderTasks({
      sourceStatus,
      destStatus,
      sourceIndex: source.index,
      destIndex: destination.index,
    }));

    // If moved to different column, update status in backend
    if (sourceStatus !== destStatus) {
      const taskId = result.draggableId;
      dispatch(updateTaskStatus({ id: taskId, status: destStatus }));
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
    handleMenuClose();
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
    setEditingAITask(null);
  };

  const handleEditAITask = (task: {title: string; description: string}) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setEditingAITask(task);
    setEditingTask({
      _id: 'temp-ai-task',
      title: task.title,
      description: task.description,
      dueDate: tomorrow.toISOString().split('T')[0],
      status: TaskStatus.TODO,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsTaskFormOpen(true);
  };

  const handleDateFilterChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateFilters({
      startDate: '',
      endDate: '',
    });
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return '#f44336';
      case TaskStatus.IN_PROGRESS:
        return '#ff9800';
      case TaskStatus.DONE:
        return '#4caf50';
      default:
        return '#9e9e9e';
    }
  };

  const filteredTasks = (tasks: Task[]) => {
    return tasks.filter(task => {
      // Text search filter
      const matchesSearch = !debouncedFilters.searchTerm || 
        task.title.toLowerCase().includes(debouncedFilters.searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(debouncedFilters.searchTerm.toLowerCase());

      // Date range filter
      const taskDueDate = new Date(task.dueDate);
      const startDate = debouncedFilters.startDate ? new Date(debouncedFilters.startDate) : null;
      const endDate = debouncedFilters.endDate ? new Date(debouncedFilters.endDate) : null;

      const matchesStartDate = !startDate || taskDueDate >= startDate;
      const matchesEndDate = !endDate || taskDueDate <= endDate;

      return matchesSearch && matchesStartDate && matchesEndDate;
    });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ZigTask Dashboard
          </Typography>
          
          <TextField
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ 
              mr: 2, 
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
              },
              '& .MuiInputBase-input': { color: 'white' },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Start Date"
            type="date"
            value={dateFilters.startDate}
            onChange={(e) => handleDateFilterChange('startDate', e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{
              mr: 2,
              minWidth: 150,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
              },
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
            }}
          />

          <TextField
            label="End Date"
            type="date"
            value={dateFilters.endDate}
            onChange={(e) => handleDateFilterChange('endDate', e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{
              mr: 2,
              minWidth: 150,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
              },
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
            }}
          />

          <Button
            variant="outlined"
            onClick={clearFilters}
            size="small"
            sx={{
              mr: 2,
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.5)',
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Clear
          </Button>

          <IconButton onClick={handleMenuOpen} color="inherit">
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.fullName?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleThemeToggle}>
              {mode === 'light' ? <DarkMode sx={{ mr: 1 }} /> : <LightMode sx={{ mr: 1 }} />}
              {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Sign Out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>



      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        {/* Task Columns - 2/3 of screen */}
        <Box sx={{ width: '66.67%', p: 3, overflow: 'hidden' }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              height: '100%',
              minHeight: 0,
            }}>
              {Object.entries(TaskStatus).map(([, status]) => (
                <Box key={status} sx={{ 
                  flex: 1, 
                  minWidth: 0,
                  height: '100%',
                  display: 'flex',
                }}>
                <Card 
                  sx={{ 
                    width: '100%',
                    height: '100%',
                    minHeight: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    border: `1px solid rgba(255, 255, 255, 0.2)`,
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                      : '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Chip
                        label={status}
                        sx={{
                          backgroundColor: getStatusColor(status),
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({filteredTasks(groupedTasks[status] || []).length})
                      </Typography>
                    </Box>

                    <Droppable droppableId={status}>
                      {(provided, snapshot) => (
                        <Box
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          sx={{ 
                            flex: 1,
                            minHeight: 0,
                            overflowY: 'auto',
                            backgroundColor: snapshot.isDraggingOver 
                              ? theme.palette.mode === 'dark' 
                                ? 'rgba(14, 165, 233, 0.15)' 
                                : 'rgba(14, 165, 233, 0.08)'
                              : 'transparent',
                            border: snapshot.isDraggingOver 
                              ? '2px dashed rgba(14, 165, 233, 0.5)'
                              : '2px dashed transparent',
                            borderRadius: '16px',
                            transition: 'all 0.3s ease',
                            p: 1,
                            '&::-webkit-scrollbar': {
                              width: '6px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                              borderRadius: '3px',
                            },
                          }}
                        >
                          {filteredTasks(groupedTasks[status] || []).length === 0 ? (
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                minHeight: '400px',
                                opacity: 0.5,
                                textAlign: 'center',
                              }}
                            >
                              <Typography variant="h3" sx={{ mb: 1, fontSize: '2rem' }}>
                                📝
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                No tasks yet
                              </Typography>
                            </Box>
                          ) : (
                            filteredTasks(groupedTasks[status] || []).map((task, index) => (
                              <Draggable key={task._id} draggableId={task._id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    style={{
                                      ...provided.draggableProps.style,
                                      transform: snapshot.isDragging 
                                        ? `${provided.draggableProps.style?.transform} rotate(8deg) scale(1.05)`
                                        : provided.draggableProps.style?.transform,
                                      zIndex: snapshot.isDragging ? 1000 : 'auto',
                                      opacity: snapshot.isDragging ? 0.9 : 1,
                                    }}
                                  >
                                    <TaskCard
                                      task={task}
                                      onEdit={() => handleEditTask(task)}
                                      dragHandleProps={provided.dragHandleProps}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}
                        </Box>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              </Box>
            ))}
            </Box>
          </DragDropContext>

          <Fab
            color="primary"
            aria-label="add task"
            sx={{ position: 'fixed', bottom: 16, left: 'calc(66.67% - 80px)' }}
            onClick={() => setIsTaskFormOpen(true)}
          >
            <AddIcon />
          </Fab>

          <TaskForm
            open={isTaskFormOpen}
            onClose={handleCloseTaskForm}
            task={editingTask}
          />
        </Box>

        {/* AI Sidebar - 1/3 of screen */}
        <AITaskSuggestions 
          onEditTask={handleEditAITask}
        />
      </Box>
    </>
  );
};

export default DashboardPage; 