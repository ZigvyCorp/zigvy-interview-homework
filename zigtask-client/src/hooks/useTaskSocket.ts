import { useEffect } from 'react';
import { socketService } from '../services/socket.service';
import { Task } from '../types/task';

export const useTaskSocket = (taskId: string, onTaskUpdate: (task: Task) => void) => {
  useEffect(() => {
    socketService.connect();
    socketService.subscribeToTaskUpdates(taskId, onTaskUpdate);

    return () => {
      socketService.unsubscribeFromTaskUpdates(taskId);
    };
  }, [taskId, onTaskUpdate]);
};
