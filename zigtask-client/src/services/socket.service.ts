import { io, Socket } from 'socket.io-client';
import { authService } from './authService';
import { Task } from '../types/task';

type TaskUpdateEvent = Task;

export class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect() {
    if (this.socket?.connected) return;
    
    this.socket = io(process.env.REACT_APP_WS_URL || 'http://localhost:3000', {
      auth: {
        token: authService.getAccessToken()
      },
      transports: ['websocket'],
      reconnection: true
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });
  }

  subscribeToTaskUpdates(taskId: string, callback: (task: TaskUpdateEvent) => void) {
    this.socket?.emit('joinTaskRoom', taskId);
    this.socket?.on('taskUpdated', callback);
  }

  unsubscribeFromTaskUpdates(taskId: string) {
    this.socket?.off('taskUpdated');
  }

  disconnect() {
    this.socket?.disconnect();
  }
}

export const socketService = SocketService.getInstance();
