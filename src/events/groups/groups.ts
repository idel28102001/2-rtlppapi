import { huobiP2PBankDict } from '../enums/P2P/huobi/huobiP2PBank.enum';
import { huobiP2PCoinDict } from '../enums/P2P/huobi/huobiP2PCoin.enum';
import { HuobiP2P } from '../connects/P2P/huobiP2P';

import { BybitP2P } from '../connects/P2P/bybitP2P';
import { bybitP2PCoinDict } from '../enums/P2P/bybit/bybitP2PCoin.enum';
import { bybitP2PBankDict } from '../enums/P2P/bybit/bybitP2PBank.enum';

import { bizlatoP2PBankDict } from '../enums/P2P/bitzlato/bitzlatoP2PBank.enum';
import { bizlatoCoinP2PDict } from '../enums/P2P/bitzlato/bitzlatoP2PCoin.enum';
import { BitzlatoP2P } from '../connects/P2P/bitzlatoP2P';
import { binanceP2PBankDict } from '../enums/P2P/binance/binanceP2PBank.enum';
import { binanceCoinP2PDict } from '../enums/P2P/binance/binanceP2PCoin.enum';
import { BinanceP2P } from '../connects/P2P/binanceP2P';
import { garantexP2PBankDict } from '../enums/P2P/garantex/garantexP2PBank.enum';
import { garantexP2PCoinDict } from '../enums/P2P/garantex/garantexP2PCoin.enum';
import { GarantexP2P } from '../connects/P2P/garantexP2P';
import { binanceDict } from '../enums/SPOT/binance.enum';
import { Garantex } from '../connects/SPOT/garantex';
import { garantexDict } from '../enums/SPOT/garantex.enum';
import { Binance } from '../connects/SPOT/binance';

export class P2PArray {
  array = {};
  readonly amount = 20000;
  constructor() {
    const P2P = {};
    P2P['HUOBI'] = {
      amount: this.amount,
      P2PDict: huobiP2PBankDict,
      P2PCoinDict: huobiP2PCoinDict,
      P2P: HuobiP2P,
    };
    P2P['BYBIT'] = {
      amount: this.amount,
      P2PDict: bybitP2PBankDict,
      P2PCoinDict: bybitP2PCoinDict,
      P2P: BybitP2P,
    };
    P2P['BITZLATO'] = {
      amount: this.amount,
      P2PDict: bizlatoP2PBankDict,
      P2PCoinDict: bizlatoCoinP2PDict,
      P2P: BitzlatoP2P,
    };
    P2P['BINANCE'] = {
      amount: this.amount,
      P2PDict: binanceP2PBankDict,
      P2PCoinDict: binanceCoinP2PDict,
      P2P: BinanceP2P,
    };
    P2P['GARANTEX'] = {
      amount: this.amount,
      P2PDict: garantexP2PBankDict,
      P2PCoinDict: garantexP2PCoinDict,
      P2P: GarantexP2P,
    };
    this.array['P2P'] = P2P;

    const SPOT = {};
    SPOT['BINANCE'] = { SPOTCoinDict: binanceDict, SPOT: Binance };
    SPOT['GARANTEX'] = { SPOTCoinDict: garantexDict, SPOT: Garantex };
    this.array['SPOT'] = SPOT;
  }
}
