import { huobiP2PCurrEnum } from '../../enums/P2P/huobi/huobiP2PCurr.enum';
import { huobiP2PCoinEnum } from '../../enums/P2P/huobi/huobiP2PCoin.enum';
import { huobiP2PBankEnum } from '../../enums/P2P/huobi/huobiP2PBank.enum';
import { Iteration } from '../../../common/iteration';

export class HuobiP2P {
  private readonly _fiat;
  private readonly _token;
  private readonly _payTypes;
  private readonly _autoUpdateTime = 5000;
  private readonly _transAmount;
  private _latestBuyPrice;
  private _latestSellPrice;

  private object;

  constructor({
    currency = huobiP2PCurrEnum.RUB,
    coin = huobiP2PCoinEnum.BTC,
    payTypes = huobiP2PBankEnum.TINKOFF,
    transAmount = 20000,
  }) {
    this._fiat = currency;
    this._token = coin;
    this._payTypes = payTypes;
    this._transAmount = transAmount;
    this.setup();

    this.object = {
      fiat: this._fiat,
      token: this._token,
      paymentMethod: this._payTypes,
    };
  }

  get BUY() {
    return this._latestBuyPrice;
  }

  get SELL() {
    return this._latestBuyPrice;
  }

  getAllBills() {
    return { buy: this._latestBuyPrice, sell: this._latestSellPrice };
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

  updateRate = async (object) => {
    return await this.fetchP2PData(object)
      .then((binanceData: any) => {
        const element = binanceData.data.slice(0, 2).slice(-1)[0];
        this._latestBuyPrice = element.price;
        return element;
      })
      .catch((error) => {
        this._latestBuyPrice = null;
      });
  };
  fetchP2PData = async ({ fiat, token, paymentMethod }) => {
    const elems = new URLSearchParams({
      currency: fiat,
      coinId: token,
      tradeType: 'sell',
      currPage: '1',
      payMethod: paymentMethod,
      blockType: 'general',
      online: '1',
      amount: this._transAmount,
    });
    return fetch(
      `https://otc-api.trygofast.com/v1/data/trade-market?${elems}`,
      {
        method: 'GET',
        headers: {
          Host: 'otc-api.trygofast.com',
        },
      },
    ).then((e) => e.json());
  };
}
