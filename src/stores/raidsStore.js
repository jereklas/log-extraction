import { decorate, observable, reaction } from "mobx";
import axios from "axios";
import request from "services/request";

const weekInNanoSeconds = 7 * 24 * 60 * 60 * 1000;
const Wednesday = 3;
const Thursday = 4;
const weeks = 4;
const requestDelay = 2000;

class RaidsStore {
  raidsById = {};
  fightsByRaidId = {};
  parsesByRaider = {};
  zones = {};

  loading = true;
  loadingBracketParses = true;
  loadingOverallParses = true;
  loadingZones = true;
  error = "";
  timeRemaining = 0;

  medianBracket = [];
  bestBracket = [];
  medianOverall = [];
  bestOverall = [];

  healers = [
    "Aemon",
    "Amonmin",
    "Dabaslab",
    "Doublebubble",
    "Jaiden",
    "Jerico",
    "Naglepally",
    "Rodney",
    "Sarianne",
    "Egstric",
    "Erelis",
  ];
  start;
  end;

  constructor() {
    // this.storageRaidsById = JSON.parse(localStorage.getItem("raids")) ?? {};
    // this.fightsByRaidId = JSON.parse(localStorage.getItem("fights")) ?? {};
    // this.parsesByRaider = JSON.parse(localStorage.getItem("parses")) ?? {};

    this.start = Date.now();
    const raidCutoff = this.start - weeks * weekInNanoSeconds;
    const parseCutoff = this.start - 6 * weekInNanoSeconds;

    request({ url: "/zones" }).then((response) => {
      this.zones = response;
      this.loadingZones = false;
    });

    request({
      url: "/reports/guild/RIVAL/Fairbanks/US",
    }).then((response) => {
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

          const secondsRemaining = Math.floor(((raiders.length + 3) * requestDelay) / 1000);
          this.timeRemaining = secondsRemaining;
          for (let i = 0; i < secondsRemaining; i++) {
            setTimeout(() => {
              this.timeRemaining = this.timeRemaining - 1;
            }, i * 1000);
          }

          for (let i = 0; i < raiders.length; i++) {
            setTimeout(() => {
              const raider = raiders[i];
              bracketRequests.push(
                request({
                  url: `/parses/character/${raider}/Fairbanks/US`,
                  params: { bracket: -1, metric: this.healers.includes(raider) ? "hps" : "dps" },
                })
              );
            }, requestDelay * i);
          }

          const overallRequests = [];
          for (let i = 0; i < raiders.length; i++) {
            setTimeout(() => {
              const raider = raiders[i];
              overallRequests.push(
                request({
                  url: `/parses/character/${raider}/Fairbanks/US`,
                  params: { metric: this.healers.includes(raider) ? "hps" : "dps" },
                })
              );
            }, requestDelay * i);
          }

          setTimeout(() => {
            axios
              .all(bracketRequests)
              .then(
                axios.spread((...bracketResponses) => {
                  bracketResponses.forEach((response) => {
                    if (response[0]) {
                      const name = response[0].characterName;
                      this.parsesByRaider[name].bracket = {};
                      const data = response.filter((parse) => parse.startTime > parseCutoff);

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
                this.error =
                  "There were too many requests made recently to WarcraftLogs. Try again in like 10 minutes to allow my api key to becoming unlocked and then try re-loading the page.";
                this.loadingBracketParses = false;
              });
          }, raiders.length * requestDelay);

          setTimeout(() => {
            axios
              .all(overallRequests)
              .then(
                axios.spread((...overallResponses) => {
                  overallResponses.forEach((response) => {
                    if (response[0]) {
                      const name = response[0].characterName;
                      this.parsesByRaider[name].overall = {};
                      const data = response.filter((parse) => parse.startTime > parseCutoff);

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
                this.error =
                  "There were too many requests made recently to WarcraftLogs. Try again in like 10 minutes to allow my api key to becoming unlocked and then try re-loading the page.";
                this.loadingOverallParses = false;
              });
          }, (raiders.length + 2) * requestDelay);
        })
      );
    });
  }

  updateWhenFinished = reaction(
    () => this.loadingBracketParses || this.loadingOverallParses || this.loadingZones,
    () => {
      if (!this.loadingBracketParses && !this.loadingOverallParses && !this.loadingZones) {
        this.end = Date.now();
        console.log("done loading, time elapsed: ", this.end - this.start);

        const raiders = Object.keys(this.parsesByRaider).sort();
        raiders.forEach((raider) => {
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
        // localStorage.setItem("raids", JSON.stringify(this.raidsById));
        // localStorage.setItem("fights", JSON.stringify(this.fightsByRaidId));
        // localStorage.setItem("parses", JSON.stringify(this.parsesByRaider));
      }
    }
  );
}

decorate(RaidsStore, {
  error: observable,
  healers: observable,
  loading: observable,
  loadingBracketParses: observable,
  loadingOverallParses: observable,
  timeRemaining: observable,
  loadingZones: observable,
  bestBracket: observable,
  medianBracket: observable,
  bestOverall: observable,
  medianOverall: observable,
  zones: observable,
});

export default RaidsStore;
