export class SPOTGroup {
  public group: Record<any, any> = {};
  constructor({ SPOTCoinDict, SPOT }) {
    Object.entries(SPOTCoinDict).forEach(([key, value]) => {
      this.group[key] = {};
      this.group[key] = new SPOT({
        coin: value,
      });
    });
  }
}
