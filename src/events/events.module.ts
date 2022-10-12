import { Module } from '@nestjs/common';
import { EventsService } from './services/events.service';
import { EventsGateway } from './gateways/events.gateway';

@Module({
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
