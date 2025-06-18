import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import { Warning } from '@mui/icons-material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  severity?: 'warning' | 'error' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  severity = 'warning',
}) => {
  const theme = useTheme();

  const getSeverityColor = () => {
    switch (severity) {
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#0ea5e9';
      default:
        return '#f59e0b';
    }
  };

  const getSeverityIcon = () => {
    return <Warning sx={{ color: getSeverityColor(), fontSize: 48 }} />;
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: theme.palette.mode === 'dark' 
            ? 'rgba(30, 30, 30, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: `1px solid ${theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)'}`,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 20px 40px rgba(0, 0, 0, 0.3)'
            : '0 20px 40px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
        }
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        pb: 1, 
        pt: 3,
        fontSize: '1.25rem',
        fontWeight: 700,
      }}>
        {title}
      </DialogTitle>

      <DialogContent sx={{ 
        textAlign: 'center', 
        pb: 2,
        px: 3,
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 2 
        }}>
          {getSeverityIcon()}
          
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              lineHeight: 1.6,
              fontSize: '1rem',
            }}
          >
            {message}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        justifyContent: 'center', 
        gap: 2, 
        pb: 3, 
        px: 3 
      }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          size="large"
          sx={{
            minWidth: 100,
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            border: `2px solid ${theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.2)' 
              : 'rgba(0, 0, 0, 0.2)'}`,
            '&:hover': {
              border: `2px solid ${theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.3)' 
                : 'rgba(0, 0, 0, 0.3)'}`,
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.05)',
            }
          }}
        >
          {cancelText}
        </Button>
        
        <Button
          onClick={onConfirm}
          variant="contained"
          size="large"
          sx={{
            minWidth: 100,
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            backgroundColor: getSeverityColor(),
            background: `linear-gradient(135deg, ${getSeverityColor()}, ${getSeverityColor()}cc)`,
            '&:hover': {
              backgroundColor: getSeverityColor(),
              filter: 'brightness(1.1)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog; 