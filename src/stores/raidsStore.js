import { action, decorate, observable, reaction } from "mobx";
import axios from "axios";
import request from "services/request";

const weekInNanoSeconds = 7 * 24 * 60 * 60 * 1000;
const Wednesday = 3;
const Thursday = 4;
const weeks = 4;
const requestDelay = 350;

class RaidsStore {
  raidsById = {};
  fightsByRaidId = {};
  parsesByRaider = {};
  zones = {};

  loading = true;
  loadingBracketParses = true;
  loadingOverallParses = true;
  loadingZones = true;

  medianBracket = [];
  bestBracket = [];
  medianOverall = [];
  bestOverall = [];

  start;
  end;

  constructor() {
    this.storageRaidsById = JSON.parse(localStorage.getItem("raids")) ?? {};
    this.fightsByRaidId = JSON.parse(localStorage.getItem("fights")) ?? {};
    this.parsesByRaider = JSON.parse(localStorage.getItem("parses")) ?? {};

    this.start = Date.now();
    const raidCutoff = this.start - weeks * weekInNanoSeconds;

    request({ url: "/zones" }).then((response) => {
      this.zones = response;
      this.loadingZones = false;
    });

    request({
      url: "/reports/guild/RIVAL/Fairbanks/US",
    }).then((response) => {
      console.log("have guild fights");
      const raidsToGetFightsFor = [];
      Object.values(response).forEach((raid, idx) => {
        const duration = raid.end - raid.start;
        if (duration > 0) {
          const dayOfWeek = new Date(raid.start).getDay();
          this.raidsById[raid.id] = raid;

          if (raid.start > raidCutoff && (dayOfWeek === Wednesday || dayOfWeek === Thursday) && raid.zone === 1002) {
            raidsToGetFightsFor.push(raid.id);
          }
        }
      });

      const raidsPreviouslyParsed = Object.keys(this.storageRaidsById);
      let needToGetData = false;

      raidsToGetFightsFor.forEach((id) => {
        if (!raidsPreviouslyParsed.includes(id)) {
          needToGetData = true;
        }
      });

      if (needToGetData) {
        console.log("grabbing data from warcraft logs");
        const requests = [];
        raidsToGetFightsFor.forEach((raidId) => {
          requests.push(request({ url: `/report/fights/${raidId}` }));
        });

        axios.all(requests).then(
          axios.spread((...responses) => {
            const fightsToGetRaidersFrom = [];
            Object.values(this.raidsById).forEach((raid) => {
              responses.forEach((response) => {
                this.fightsByRaidId[raid.id] = response;
                if (raid.start === response.start && raid.title === response.title) {
                  fightsToGetRaidersFrom.push(response);
                }
              });
            });

            fightsToGetRaidersFrom.forEach((fight) => {
              fight.exportedCharacters.forEach((char) => {
                this.parsesByRaider[char.name] = {};
              });
            });

            //send parse requests for bracket parses delayed between each other to prevent api lockout
            const bracketRequests = [];
            const raiders = Object.keys(this.parsesByRaider);
            console.log("raiders found:", raiders.length);
            for (let i = 0; i < raiders.length; i++) {
              const raider = raiders[i];
              bracketRequests.push(
                request({ url: `/parses/character/${raider}/Fairbanks/US`, params: { bracket: -1 } })
              );
            }

            const overallRequests = [];
            for (let i = 0; i < raiders.length; i++) {
              const raider = raiders[i];
              overallRequests.push(request({ url: `/parses/character/${raider}/Fairbanks/US` }));
            }

            axios
              .all(bracketRequests)
              .then(
                axios.spread((...bracketResponses) => {
                  bracketResponses.forEach((response) => {
                    if (response[0]) {
                      const name = response[0].characterName;
                      this.parsesByRaider[name].bracket = {};
                      const data = response.filter((parse) => parse.startTime > raidCutoff);

                      data.forEach((encounter) => {
                        if (!this.parsesByRaider[name].bracket[encounter.encounterID]) {
                          this.parsesByRaider[name].bracket[encounter.encounterID] = [];
                        }
                        this.parsesByRaider[name].bracket[encounter.encounterID].push(encounter.percentile);
                      });
                    }
                  });
                  this.loadingBracketParses = false;
                })
              )
              .catch((errors) => {
                console.log(errors);
                this.loadingBracketParses = false;
              });

            axios
              .all(overallRequests)
              .then(
                axios.spread((...overallResponses) => {
                  overallResponses.forEach((response) => {
                    if (response[0]) {
                      const name = response[0].characterName;
                      this.parsesByRaider[name].overall = {};
                      const data = response.filter((parse) => parse.startTime > raidCutoff);

                      data.forEach((encounter) => {
                        if (!this.parsesByRaider[name].overall[encounter.encounterID]) {
                          this.parsesByRaider[name].overall[encounter.encounterID] = [];
                        }
                        this.parsesByRaider[name].overall[encounter.encounterID].push(encounter.percentile);
                      });
                    }
                  });
                  this.loadingOverallParses = false;
                })
              )
              .catch((errors) => {
                console.log(errors);
                this.loadingOverallParses = false;
              });
          })
        );
      } else {
        // we're done loading because it was found in local storage
        this.loadingBracketParses = false;
        this.loadingOverallParses = false;
      }
    });
  }

  updateWhenFinished = reaction(
    () => this.loadingBracketParses || this.loadingOverallParses || this.loadingZones,
    () => {
      if (!this.loadingBracketParses && !this.loadingOverallParses && !this.loadingZones) {
        this.end = Date.now();
        console.log("done loading, time elapsed: ", this.end - this.start);

        Object.keys(this.parsesByRaider).forEach((raider) => {
          const bestBracketRow = { name: raider };
          const medianBracketRow = { name: raider };
          const bestOverallRow = { name: raider };
          const medianOverallRow = { name: raider };

          if (this.parsesByRaider[raider].bracket) {
            Object.keys(this.parsesByRaider[raider].bracket).forEach((boss) => {
              let best = 0;
              let average = 0;
              let count = 0;
              this.parsesByRaider[raider].bracket[boss].forEach((percentile) => {
                if (percentile > best) {
                  best = percentile;
                }

                average += percentile;
                count += 1;
              });
              average /= count;
              bestBracketRow[boss] = Number.isInteger(best) ? best : best.toFixed(2);
              medianBracketRow[boss] = Number.isInteger(average) ? average : average.toFixed(2);
            });
          }

          if (this.parsesByRaider[raider].overall) {
            Object.keys(this.parsesByRaider[raider].overall).forEach((boss) => {
              let best = 0;
              let average = 0;
              let count = 0;
              this.parsesByRaider[raider].overall[boss].forEach((percentile) => {
                if (percentile > best) {
                  best = percentile;
                }

                average += percentile;
                count += 1;
              });
              average /= count;
              bestOverallRow[boss] = Number.isInteger(best) ? best : best.toFixed(2);
              medianOverallRow[boss] = Number.isInteger(average) ? average : average.toFixed(2);
            });
          }
          this.bestBracket.push(bestBracketRow);
          this.medianBracket.push(medianBracketRow);
          this.bestOverall.push(bestOverallRow);
          this.medianOverall.push(medianOverallRow);
        });

        this.loading = false;
        localStorage.setItem("raids", JSON.stringify(this.raidsById));
        localStorage.setItem("fights", JSON.stringify(this.fightsByRaidId));
        localStorage.setItem("parses", JSON.stringify(this.parsesByRaider));
      }
    }
  );
}

decorate(RaidsStore, {
  loading: observable,
  loadingBracketParses: observable,
  loadingOverallParses: observable,
  loadingZones: observable,
  bestBracket: observable,
  medianBracket: observable,
  bestOverall: observable,
  medianOverall: observable,
  zones: observable,
});

export default RaidsStore;
