import { garantexMethodEnum } from '../../enums/P2P/garantex/garantex.method.enum';

export class GarantexP2P {
  private _autoUpdateTime = 5000;
  private _latestBuyPrice = null;
  private _latestSellPrice = null;
  private readonly object;

  constructor({ payTypes, transAmount = 20000 }) {
    this.object = {
      currency: 'rub',
      payment_method: payTypes,
      amount: transAmount,
    };
    this.setup();
  }

  get BUY() {
    return this._latestBuyPrice;
  }

  get SELL() {
    return this._latestSellPrice;
  }

  setup = async () => {
    await this.updateRate(this.object);
    // const iter = new Iteration();
    // await iter.setupAutoUpdate(
    //   this.object,
    //   this.updateRate,
    //   this._autoUpdateTime,
    // );
  };

  updateRate = async ({ currency, payment_method, amount }) => {
    const params = new URLSearchParams({
      currency,
      payment_method,
      amount,
    });
    const url = `https://garantex.io/api/v2/otc/ads?`;
    const buyUrl = [garantexMethodEnum.SELL, garantexMethodEnum.BUY];
    return await Promise.all(
      buyUrl.map(async (e) => {
        return await fetch(`${url}${params}&direction=${e}`)
          .then((data) => {
            return data.json();
          })
          .then((data) => {
            this._autoUpdateTime = 5000;
            const res = data as any;
            if (res && res.length > 0) {
              const item = res[0];
              switch (e) {
                case garantexMethodEnum.BUY: {
                  this._latestBuyPrice = item.price;
                  break;
                }
                case garantexMethodEnum.SELL: {
                  this._latestSellPrice = item.price;
                  break;
                }
              }
            }
          })
          .catch((error) => {
            this._autoUpdateTime = 20000;
            switch (e) {
              case garantexMethodEnum.BUY: {
                this._latestBuyPrice = null;
                break;
              }
              case garantexMethodEnum.SELL: {
                this._latestSellPrice = null;
                break;
              }
            }
            console.error(
              `Error update Garantex p2p ${e} rate with message: ${error.message}`,
            );
          });
      }),
    );
  };
}
