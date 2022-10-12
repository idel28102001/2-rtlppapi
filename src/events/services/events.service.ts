import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AllGroups } from '../groups/main.groups';
import { SocketTransforms } from '../socket-transforms/socket-transforms';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EventsService {
  private readonly allGroups = new AllGroups();

  constructor() {
    const emitToSend = new SocketTransforms({
      groups: this.allGroups.groups,
      balance: 20000,
    }).allData;
    const array = emitToSend.map((e) => e.name);
    const currPath = path.join(__dirname, '../../');
    if (!fs.existsSync(path.join(currPath, 'files'))) {
      fs.mkdirSync(path.join(currPath, 'files'));
    }
    fs.writeFileSync(
      path.join(currPath, 'files', 'names.json'),
      JSON.stringify(array),
    );
  }

  sendAllEmits(client: Socket) {
    const clientBalance = Number(client.handshake.query.balance) || 200000;
    const allData = new SocketTransforms({
      groups: this.allGroups.groups,
      balance: clientBalance,
    });
    allData.allData.forEach(({ data, name }) => {
      this.clientEmit(client, name, data);
    });
    this.clientEmit(client, 'top20', allData.getTop20);
  }

  private readonly clientEmit = (client, name, data) => {
    const sentData = data;
    // если у клиента нет подписки, то значит у всех полей
    // нужно поставить значение 0, кроме spred и profit.
    if (sentData.spred != null) {
      Object.keys(sentData).forEach((key) => {
        if (key !== 'spred' && key !== 'profit') {
          sentData[key] = 0;
        }
      });
    }
    client.emit(name, sentData);
  };
}
