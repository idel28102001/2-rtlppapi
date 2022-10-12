import * as ws from 'websocket';

export class Garantex {
  _wsUrl = 'wss://ws.garantex.io/?stream=btcrub';

  _latestBuyPrice = null;
  _latestSellPrice = null;
  private readonly coin;

  constructor({ coin }) {
    this.coin = coin;
    this.startUpdate();
  }

  get BUY() {
    return this._latestBuyPrice;
  }

  get SELL() {
    return this._latestSellPrice;
  }

  startUpdate = () => {
    const wsClient = new ws.client();

    wsClient.on('connect', (connection) => {
      connection.on('error', (err) => {
        console.log(`Error connection Garantex socket with message "${err}".`);
      });

      connection.on('close', (code) => {
        console.log(`Connection to Garantex socket closed with code: ${code}`);
        wsClient.connect(this._wsUrl);
      });

      connection.on('message', (message) => {
        const update = JSON.parse(message.utf8Data);

        if (
          update['btcrub.update'] &&
          update['btcrub.update']['exchangers'] &&
          update['btcrub.update']['exchangers'][this.coin]
        ) {
          this._latestSellPrice =
            update['btcrub.update']['exchangers'][this.coin]['ask'][0]['price'];

          this._latestBuyPrice =
            update['btcrub.update']['exchangers'][this.coin]['bid'][0]['price'];
        }
      });
    });

    wsClient.on('connectFailed', (err) => {
      console.error(
        `Error connect to Garantex socket. Message: ${err.message}`,
      );
      wsClient.connect(this._wsUrl);
    });

    wsClient.connect(this._wsUrl);
  };
}
