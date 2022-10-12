import { P2PArray } from './groups';
import { P2PGroup } from './P2P.groups';
import { SPOTGroup } from './SPOT.groups';

export class AllGroups {
  groups = {} as any;
  constructor() {
    const elem = new P2PArray();
    Object.entries(elem.array).forEach(([type, array]) => {
      this.groups[type] = {};
      switch (type) {
        case 'P2P': {
          Object.entries(array).forEach(([key, value]) => {
            this.groups[type][key] = new P2PGroup(value as any).group;
          });
          break;
        }
        case 'SPOT': {
          Object.entries(array).forEach(([key, value]) => {
            this.groups[type][key] = new SPOTGroup(value).group;
          });
          break;
        }
      }
    });
  }
}
