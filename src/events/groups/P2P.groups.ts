export class P2PGroup {
  public group: Record<any, any> = {};
  constructor({ amount = 20000, P2PDict, P2PCoinDict, P2P }) {
    Object.entries(P2PDict).forEach(([key, value]) => {
      Object.entries(P2PCoinDict).forEach(([key1, value1]) => {
        this.group[key] = this.group[key] || {};
        this.group[key][key1] = new P2P({
          transAmount: amount,
          coin: value1 as any,
          payTypes: value,
        });
      });
    });
  }
}
