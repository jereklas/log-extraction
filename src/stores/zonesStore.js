import { decorate, observable } from "mobx";
import request from "services/request";

class ZonesStore {
  constructor() {
    // request({ url: "/zones" }).then((response) => {
    //   Object.values(response).forEach((zone) => {
    //     this.zones.push(zone);
    //   });
    // });
  }

  zones = [];

  getZoneName = (id) => {
    let name = "";
    this.zones.forEach((zone) => {
      if (zone.id === id) {
        name = zone.name;
      }
    });
    return name;
  };
}

decorate(ZonesStore, {
  zones: observable,
});

export default ZonesStore;
