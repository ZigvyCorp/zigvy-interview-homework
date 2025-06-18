/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Skeleton,
  Fade,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Send,
  Add,
  Edit,
  Delete,
  AutoAwesome,
  Psychology,
  PlaylistAdd,
} from '@mui/icons-material';
import { useAppDispatch } from '../store/hooks';
import { createTask, fetchTasksGrouped } from '../store/tasksSlice';
import { TaskStatus } from '../types';
import { aiApi } from '../utils/api';

interface SuggestedTask {
  title: string;
  description: string;
}

interface AITaskSuggestionsProps {
  onEditTask?: (task: SuggestedTask) => void;
}

const AITaskSuggestions: React.FC<AITaskSuggestionsProps> = ({ onEditTask }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedTask[]>([]);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const handleGenerateSuggestions = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    
    // Clear old suggestions when generating new ones
    setSuggestions([]);

    try {
      const response = await aiApi.suggestTasks(prompt);
      const data = response.data;
      
      // Parse suggestions from API response
      const parsedSuggestions = data.data.suggestions
        .filter((suggestion: string) => suggestion.includes(' - '))
        .map((suggestion: string) => {
          const [title, ...descParts] = suggestion.split(' - ');
          return {
            title: title.trim(),
            description: descParts.join(' - ').trim(),
          };
        });

      setSuggestions(parsedSuggestions);
    } catch (err) {
      setError('Failed to generate AI suggestions. Please try again.');
      console.error('AI suggestion error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToTodo = (task: SuggestedTask, index: number) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    dispatch(createTask({
      title: task.title,
      description: task.description,
      dueDate: tomorrow.toISOString().split('T')[0],
      status: TaskStatus.TODO,
    }) as any);

    // Remove the task from suggestions list
    handleDeleteSuggestion(index);
    
    // Refresh tasks
    setTimeout(() => {
      dispatch(fetchTasksGrouped() as any);
    }, 100);
  };

  const handleAddAllToTodo = () => {
    suggestions.forEach((task) => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      dispatch(createTask({
        title: task.title,
        description: task.description,
        dueDate: tomorrow.toISOString().split('T')[0],
        status: TaskStatus.TODO,
      }) as any);
    });

    // Clear all suggestions
    setSuggestions([]);
    
    // Refresh tasks
    setTimeout(() => {
      dispatch(fetchTasksGrouped() as any);
    }, 100);
  };

  const handleDeleteSuggestion = (index: number) => {
    setSuggestions(prev => prev.filter((_, i) => i !== index));
  };

  const LoadingDots = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, p: 2 }}>
      <Psychology sx={{ color: 'primary.main', mr: 1 }} />
      <Typography variant="body2" color="text.secondary">
        AI is thinking
      </Typography>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            animation: `bounce 1.4s infinite ease-in-out both`,
            animationDelay: `${i * 0.16}s`,
            '@keyframes bounce': {
              '0%, 80%, 100%': {
                transform: 'scale(0)',
              },
              '40%': {
                transform: 'scale(1)',
              },
            },
          }}
        />
      ))}
    </Box>
  );

  const SkeletonCard = () => (
    <Card sx={{ mb: 2, opacity: 0.7 }}>
      <CardContent>
        <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="60%" height={20} />
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={60} height={32} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={60} height={32} sx={{ borderRadius: 1 }} />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        width: '33.33%',
        height: '100%',
        background: theme.palette.mode === 'dark' 
          ? 'rgba(20, 20, 20, 0.95)' 
          : 'rgba(248, 250, 252, 0.95)',
        backdropFilter: 'blur(20px)',
        borderLeft: `1px solid ${theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(0, 0, 0, 0.1)'}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: `1px solid rgba(255, 255, 255, 0.1)` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AutoAwesome sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            AI Task Suggestions
          </Typography>
        </Box>
        
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Describe what you want to accomplish... (e.g., I want to improve my productivity this week)"
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            // Clear suggestions when prompt changes significantly
            if (suggestions.length > 0 && e.target.value.trim() === '') {
              setSuggestions([]);
            }
          }}
          disabled={isLoading}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(255, 255, 255, 0.8)',
            },
          }}
        />
        
        <Button
          fullWidth
          variant="contained"
          onClick={handleGenerateSuggestions}
          disabled={!prompt.trim() || isLoading}
          startIcon={<Send />}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
            '&:hover': {
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
            },
            mb: suggestions.length > 0 ? 2 : 0,
          }}
        >
          {isLoading ? 'Generating...' : 'Generate Ideas'}
        </Button>

        {suggestions.length > 0 && (
          <Button
            fullWidth
            variant="outlined"
            onClick={handleAddAllToTodo}
            startIcon={<PlaylistAdd />}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
              borderColor: '#10b981',
              color: '#10b981',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
                borderColor: '#059669',
              },
            }}
          >
            Add All to Tasks
          </Button>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        {error && (
          <Card sx={{ mb: 2, backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444' }}>
            <CardContent>
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <Fade in={isLoading}>
            <Box>
              <LoadingDots />
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </Box>
          </Fade>
        )}

        {suggestions.map((task, index) => (
          <Fade in={true} key={index} timeout={300 + index * 100}>
            <Card
              sx={{
                mb: 2,
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: `1px solid rgba(255, 255, 255, 0.2)`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                    : '0 8px 32px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 1,
                    color: theme.palette.text.primary,
                  }}
                >
                  {task.title}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2,
                    lineHeight: 1.5,
                  }}
                >
                  {task.description}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleAddToTodo(task, index)}
                    startIcon={<Add />}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669, #047857)',
                      },
                    }}
                  >
                    Add
                  </Button>
                  
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => onEditTask?.(task)}
                    startIcon={<Edit />}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontSize: '0.75rem',
                    }}
                  >
                    Edit
                  </Button>
                  
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteSuggestion(index)}
                    sx={{
                      color: '#ef4444',
                      '&:hover': {
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      },
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        ))}

        {suggestions.length === 0 && !isLoading && !error && (
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
              opacity: 0.6,
            }}
          >
            <AutoAwesome sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }} />
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              No suggestions yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter a prompt above to get AI-powered task suggestions
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AITaskSuggestions; 