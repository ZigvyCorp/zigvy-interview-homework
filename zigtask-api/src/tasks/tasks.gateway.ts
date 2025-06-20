import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Task } from './entities/task.entity';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3001',
    credentials: true
  }
})
export class TasksGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  
  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      await this.jwtService.verify(token);
    } catch (e) {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinTaskRoom')
  handleJoinTaskRoom(client: Socket, taskId: string) {
    client.join(`task_${taskId}`);
  }

  broadcastTaskUpdate(task: Task) {
    this.server.to(`task_${task.id}`).emit('taskUpdated', task);
  }

  broadcastTaskDeleted(taskId: string) {
    this.server.to(`task_${taskId}`).emit('taskDeleted', taskId);
  }
}
