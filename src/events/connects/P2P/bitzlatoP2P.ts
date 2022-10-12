import { bizlatoP2PBank } from '../../enums/P2P/bitzlato/bitzlatoP2PBank.enum';

export class BitzlatoP2P {
  private readonly _autoUpdateTime = 5000;
  private _latestBuyPrice;
  private readonly object;

  constructor({
    currency = bizlatoCurrP2P.RUB,
    coin = bizlatoCoinP2P.USDT,
    payTypes = bizlatoP2PBank.TINKOFF,
    transAmount = 20000,
  }) {
    this.object = {
      fiat: currency,
      token: coin,
      paymentMethod: payTypes,
      amount: transAmount,
    };
    this.setup();
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
  get BUY() {
    return this._latestBuyPrice;
  }

  get SELL() {
    return this._latestBuyPrice;
  }

  updateRate = async (object) => {
    return await this.fetchP2PData(object)
      .then((binanceData: any) => {
        const element = binanceData.data.slice(0, 2).slice(-1)[0];
        this._latestBuyPrice = element.rate;
        return element;
      })
      .catch((error) => {
        this._latestBuyPrice = null;
      });
  };
  fetchP2PData = async ({ fiat, token, paymentMethod, amount }) => {
    const elems = new URLSearchParams({
      limit: '1',
      skip: '1',
      type: 'purchase',
      currency: fiat,
      cryptocurrency: token,
      isOwnerVerificated: 'true',
      isOwnerTrusted: 'false',
      isOwnerActive: 'false',
      paymethod: paymentMethod,
      amount,
    });
    return fetch(
      `https://bitzlato.com/api2/p2p/public/exchange/dsa/?${elems}`,
      {
        method: 'GET',
        headers: {
          Host: 'bitzlato.com',
        },
      },
    ).then((e) => e.json());
  };
}
import { bizlatoCurrP2P } from '../../enums/P2P/bitzlato/bitzlatoP2PCurr.enum';
import { bizlatoCoinP2P } from '../../enums/P2P/bitzlato/bitzlatoP2PCoin.enum';
import { Iteration } from '../../../common/iteration';
