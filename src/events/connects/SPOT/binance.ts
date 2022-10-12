// eslint-disable-next-line @typescript-eslint/no-var-requires
const BinanceAPI = require('binance-api-node').default;

export class Binance {
  private _binance = null;
  private _latest;
  private readonly coin;
  constructor({ coin }) {
    this.coin = coin;
    this.setup();
  }

  get BUY() {
    return this._latest;
  }

  get SELL() {
    return this._latest;
  }

  setup = () => {
    this._binance = new BinanceAPI();

    this.setupAutoUpdate();
  };

  setupAutoUpdate = () => {
    this._binance.ws.miniTicker(this.coin, (ticker) => {
      const currencPrice = parseFloat(ticker.curDayClose).toFixed(2);
      this._latest = Number(currencPrice);
    });
  };
}
