import { bybitP2PBankEnum } from '../../enums/P2P/bybit/bybitP2PBank.enum';

export class BybitP2P {
  private readonly _fiat;
  private readonly _token;
  private readonly _payTypes;
  private _autoUpdateTime = 5000;
  private readonly _transAmount;
  private _latestBuyPrice;
  private readonly object;

  constructor({
    currency = bybitP2PCurrEnum.RUB,
    coin = bybitP2PCoinEnum.USDT,
    payTypes = bybitP2PBankEnum.TINKOFF,
    transAmount = 20000,
  }) {
    this._fiat = currency;
    this._token = coin;
    this._payTypes = payTypes;
    this._transAmount = transAmount;
    this.object = {
      fiat: this._fiat,
      token: this._token,
      paymentMethod: this._payTypes,
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
        const element = binanceData.result.items.slice(0, 2).slice(-1)[0];
        this._latestBuyPrice = element.price;
        return element;
      })
      .catch((error) => {
        this._latestBuyPrice = null;
      });
  };
  fetchP2PData = async ({ fiat, token, paymentMethod }) => {
    const aaa = [
      `currencyId=${fiat}`,
      `tokenId=${token}`,
      `side=1`,
      `payment=${paymentMethod}`,
      `amount=${this._transAmount}`,
      `page=1`,
    ];
    return fetch('https://api2.bybit.com/spot/api/otc/item/list', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        Host: 'api2.bybit.com',
        Connection: 'keep-alive',
        'Content-Length': `${aaa.length}`,
      },
      body: aaa.join('&'),
    }).then((e) => e.json());
  };
}

import * as https from 'https';
import { bybitP2PCurrEnum } from '../../enums/P2P/bybit/bybitP2PCurr.enum';
import { bybitP2PCoinEnum } from '../../enums/P2P/bybit/bybitP2PCoin.enum';
import { Iteration } from '../../../common/iteration';
