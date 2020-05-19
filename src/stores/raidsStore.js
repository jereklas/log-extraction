import { action, decorate, observable } from "mobx";
import request from "services/request";

class RaidsStore {
  raidsById = {};
  raids = [];
  activeRaid = {};

  constructor() {
    request({
      url: "/reports/guild/RIVAL/Fairbanks/US",
    }).then((response) => {
      Object.values(response).forEach((raid, idx) => {
        const duration = raid.end - raid.start;
        if (duration > 0) {
          this.raidsById[raid.id] = raid;
          var seconds = duration / 1000;
          var hours = parseInt(seconds / 3600);
          seconds = seconds % 3600;
          var minutes = parseInt(seconds / 60);
          seconds = parseInt(seconds % 60);

          this.raidsById[raid.id].duration = `${hours}:${minutes}:${seconds}`;
          this.raids.push(raid);
        }

        // set active raid after we've added it to the dictionary
        if (idx === 0) {
          this.setActiveRaid(raid.id);
        }
      });
    });
  }

  setActiveRaid = (id) => {
    const raid = this.raidsById[id];

    if (raid) {
      this.activeRaid = raid;
      this.getFights(raid.id);
    }
  };

  getFights = (id) => {
    const raid = this.raidsById[id];

    if (raid) {
      if (!raid.fightData) {
        request({
          url: `/report/fights/${raid.id}`,
        }).then((response) => {
          this.raidsById[raid.id] = { ...raid, fightData: response };
          console.log(response);
          this.activeRaid = this.raidsById[raid.id];
        });
      }
    }
  };
}

decorate(RaidsStore, {
  activeRaid: observable,
  raids: observable,
  setActiveRaid: action,
});

export default RaidsStore;
