import { Iteration } from '../../../common/iteration';

export class BinanceP2P {
  private _autoUpdateTime = 5000;
  private readonly object;
  private _latestBuyPrice = null;

  constructor({ coin, payTypes, transAmount }) {
    this.object = {
      token: coin,
      paymentMethod: payTypes,
      amount: transAmount,
    };
    this.setup();
  }

  get BUY() {
    return this._latestBuyPrice;
  }

  get SELL() {
    return this._latestBuyPrice;
  }

  setup = async () => {
    await this.updateRate(this.object);
    const iter = new Iteration();
    await iter.setupAutoUpdate(
      this.object,
      this.updateRate,
      this._autoUpdateTime,
    );
  };

  updateRate = (object) => {
    this.fetchP2PData(object)
      .then((binanceData: any) => {
        if (binanceData && binanceData.data && binanceData.data.length > 0) {
          this._latestBuyPrice = binanceData.data[0].adv.price;
        }
      })
      .catch((error) => {
        // обнуляем последнюю цену
        this._latestBuyPrice = null;

        console.error(
          `Error update binance buy p2p rate with message: ${error.message}`,
        );
      });
  };

  fetchP2PData = async ({ token, paymentMethod, amount }) => {
    const baseObj = {
      page: 1,
      rows: 1,
      payTypes: [paymentMethod],
      publisherType: null,
      asset: token,
      tradeType: 'BUY',
      fiat: 'RUB',
      transAmount: amount,
    };
    return fetch(
      'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
      {
        method: 'POST',
        headers: {
          host: 'p2p.binance.com',
          'content-type': 'application/json',
          'Content-Length': `${Object.entries(baseObj).length}`,
        },
        body: JSON.stringify(baseObj),
      },
    ).then((e) => e.json());
  };
}
