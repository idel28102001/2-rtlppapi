import { Body, Controller, Get, Post } from '@nestjs/common';
import { WebhooksService } from '../services/webhooks.service';
import { ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhookService: WebhooksService) {}
  @Post('/payment')
  async changeStatus(@Body() data) {
    return (await this.webhookService.changeStatus(data)) || { status: 'ok' };
  }

  @Get('/allemits')
  async allEmits() {
    const currPath = path.join(__dirname, '../../');
    const all =
      fs.readFileSync(path.join(currPath, 'files', 'names.json')).toString() ||
      '';
    return JSON.parse(all);
  }
}
