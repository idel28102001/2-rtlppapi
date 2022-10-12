import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { EventsService } from '../services/events.service';

@WebSocketGateway({ cors: true })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('EventsGateway');
  private clients: Map<string, Socket> = new Map();

  constructor(private readonly eventsSerivce: EventsService) {}

  addClient(client: Socket) {
    if (!this.clients.has(client.id)) {
      this.clients.set(client.id, client);
    }
  }
  removeClient(client: Socket) {
    if (this.clients.has(client.id)) {
      this.clients.delete(client.id);
    }
  }

  afterInit(server: Server): any {
    setInterval(() => {
      this.clients.forEach((e) => {
        this.eventsSerivce.sendAllEmits(e);
      });
    }, 1500);
    this.logger.log('Initialized');
  }

  @SubscribeMessage('changeBalance')
  changeBalance(client: Socket, text: string): WsResponse<string> {
    if (!/^\d+?$/.test(text)) {
      return { event: 'error', data: 'Неверное значение баланса' };
    }
    client.handshake.query.balance = text;
    return { event: 'msgToClient', data: text };
  }

  handleDisconnect(client: Socket): any {
    this.removeClient(client);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]): any {
    this.addClient(client);
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: string): WsResponse<string> {
    return { event: 'msgToClient', data: text };
  }
}
