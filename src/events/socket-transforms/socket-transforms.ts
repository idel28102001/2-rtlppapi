export class SocketTransforms {
  private readonly groups;
  private readonly balance;
  public readonly allData = [];
  private readonly roundToN = (num: number, n: number): number => {
    const res = Math.pow(10, 2);
    return Math.round(num * res) / res;
  };
  private readonly minusPercent = (n: number | string, p: number) => {
    if (n !== 0 && !n) return null;
    n = Number(n);
    return n - n * p;
  };

  private readonly plusPercent = (n: number | string, p: number) => {
    if (n !== 0 && !n) return null;
    n = Number(n);
    return n + n * p;
  };

  readonly calculateAll1 = ({ BALANCE, BUY, SELL }) => {
    BALANCE = Number(BALANCE);
    const buyRate = this.minusPercent(BUY.RATE, BUY.KOEFF);
    const sellRate = this.minusPercent(SELL.RATE, SELL.KOEFF);
    const spred = (BALANCE / buyRate) * sellRate - BALANCE;
    const profit = (spred / BALANCE) * 100;
    return {
      buyRate,
      sellRate,
      spred,
      profit,
      data: { buyRate, sellRate, spred, BALANCE },
    };
  };

  readonly calculateAll2 = ({ BALANCE, BUY, SELL, KBANK }) => {
    const KOEFF = this.groups.P2P[BUY.SRC][KBANK]['USDT'].BUY || 1;
    BALANCE = Number(BALANCE);
    const buyRate = this.minusPercent(BUY.RATE, BUY.KOEFF);
    const sellRate = this.minusPercent(SELL.RATE, SELL.KOEFF);
    const spred = (BALANCE / KOEFF / buyRate) * sellRate - BALANCE;
    const profit = (spred / BALANCE) * 100;
    return {
      buyRate,
      sellRate,
      spred,
      profit,
    };
  };

  readonly calculateAll3 = ({ BALANCE, BUY, SELL, KBANK, SELLKOEFF }) => {
    BALANCE = Number(BALANCE);
    let sell = Number(SELL.RATE);
    let buy = Number(BUY.RATE);
    if (SELLKOEFF) {
      sell =
        Number(SELL.RATE) *
        Number(this.groups.P2P[SELL.SRC][KBANK]['USDT'].BUY);
    } else {
      buy =
        Number(BUY.RATE) * Number(this.groups.P2P[BUY.SRC][KBANK]['USDT'].BUY);
    }
    const buyRate = this.minusPercent(buy, BUY.KOEFF);
    const sellRate = this.minusPercent(sell, SELL.KOEFF);
    const spred = (BALANCE / buyRate) * sellRate - BALANCE;
    const profit = (spred / BALANCE) * 100;
    return {
      buyRate,
      sellRate,
      spred,
      profit,
      data: { buyRate, sellRate, spred, BALANCE },
    };
  };

  constructor({ groups, balance }) {
    this.allData = [];
    this.balance = balance;
    this.groups = groups;
    this.func(groups);
  }

  func(groups) {
    const toTransfer = this.createToTransfer(groups);
    toTransfer.forEach((e) => {
      this.allData.push(...this.getData(e));
    });
  }

  getData(elem) {
    const { SELL, BUY, FUNCTYPE, SELLKOEFF } = elem;
    const sell = this.getRate(SELL, 'SELL');
    const buy = this.getRate(BUY, 'BUY');
    const name = `BUY-${BUY.TYPE}-${BUY.SRC}-${BUY.COIN}-${
      BUY.BANK || 'BANK'
    }|SELL-${SELL.TYPE}-${SELL.SRC}-${SELL.COIN}-${SELL.BANK || 'BANK'}`;
    switch (FUNCTYPE) {
      case '1': {
        const data = this.calculateAll1({
          BALANCE: this.balance,
          SELL: sell,
          BUY: buy,
        });
        return [{ data, name: name + '|RUB' }];
      }
      case '2': {
        const temp = [];
        ['TINKOFF', 'SBERBANK'].forEach((e) => {
          const name2 = `${name}|KOEFF-${e}`;
          const data = this.calculateAll2({
            BALANCE: this.balance,
            SELL: sell,
            BUY: buy,
            KBANK: e,
          });
          temp.push({ data, name: name2 + '|RUB' });
        });
        return temp;
      }
      case '3': {
        const temp = [];
        ['TINKOFF', 'SBERBANK'].forEach((e) => {
          const name2 = `${name}|KOEFF-${e}`;
          const data = this.calculateAll3({
            BALANCE: this.balance,
            SELL: sell,
            BUY: buy,
            KBANK: e,
            SELLKOEFF,
          });

          temp.push({ data, name: name2 + '|RUB' });
        });
        return temp;
      }
    }
  }

  get getTop20() {
    return this.allData
      .sort((first, second) => {
        if (first.data.profit > second.data.profit) return -1;
        if (first.data.profit < second.data.profit) return 1;
        return 0;
      })
      .filter((e) => e.data.profit !== Infinity && e.data.profit !== NaN)
      .slice(0, 20);
  }

  createToTransfer(groups) {
    const toTransfer = [];
    const newArray = this.createArray(groups);
    for (const BUY of newArray) {
      for (const SELL of newArray) {
        const noToSell = SELL.TYPE === 'P2P' && SELL.SRC === 'GARANTEX';
        if (noToSell) continue;

        const sameRate = BUY.COIN === SELL.COIN;
        if (!sameRate) {
          continue;
        }

        const noToBuy = BUY.TYPE === 'P2P' && BUY.SRC === 'GARANTEX';
        if (noToBuy) continue;

        const notTheSame =
          `${BUY.TYPE}-${BUY.SRC}` === `${SELL.TYPE}-${SELL.SRC}`;
        if (notTheSame) continue;

        if (SELL !== BUY) {
          const obj = { SELL, BUY };
          const sellSpot = SELL.TYPE === 'SPOT' && SELL.SRC === 'BINANCE';
          const buySpot = BUY.TYPE === 'SPOT' && BUY.SRC === 'BINANCE';
          if (sellSpot || buySpot) {
            obj['FUNCTYPE'] = '3';
            obj['SELLKOEFF'] = sellSpot;
          } else if (BUY.SRC === 'GARANTEX') {
            obj['FUNCTYPE'] = '2';
          } else {
            obj['FUNCTYPE'] = '1';
          }
          toTransfer.push(obj);
        }
      }
    }
    return toTransfer;
  }

  createArray(groups) {
    const newArray = [];
    const koeff = { BINANCE: 0.001, GARANTEX: 0.0015 };
    Object.entries(groups).forEach(([TYPE, obj1]) => {
      Object.entries(obj1).forEach(([SRC, obj2]) => {
        if (TYPE === 'SPOT') {
          Object.entries(obj2).forEach(([COIN, obj3]) => {
            newArray.push({ TYPE, SRC, COIN, KOEFF: koeff[SRC] || 0 });
          });
        } else {
          Object.entries(obj2).forEach(([BANK, obj3]) => {
            Object.entries(obj3).forEach(([COIN, obj4]) => {
              newArray.push({ TYPE, SRC, COIN, BANK, KOEFF: koeff[SRC] || 0 });
            });
          });
        }
      });
    });
    return newArray;
  }

  getRate(object, thing = 'SELL') {
    switch (object.TYPE) {
      case 'P2P': {
        return {
          ...object,
          RATE: this.groups[object.TYPE][object.SRC][object.BANK][object.COIN][
            thing
          ],
        };
      }
      case 'SPOT': {
        return {
          ...object,
          RATE: this.groups[object.TYPE][object.SRC][object.COIN][thing],
        };
      }
    }
  }
}
