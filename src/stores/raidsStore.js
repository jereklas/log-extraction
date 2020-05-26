import { decorate, observable, reaction } from "mobx";
import axios from "axios";
import request from "services/request";

const weekInNanoSeconds = 7 * 24 * 60 * 60 * 1000;
const Wednesday = 3;
const Thursday = 4;
const weeks = 4;
const requestDelay = 2000;

class RaidsStore {
  raidsToGetFightsFor = [];
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
    "Jaidan",
    "Jerico",
    "Naglepally",
    "Rodney",
    "Sarianne",
    "Egstric",
    "Erelis",
    "Vaportrail",
  ];
  start;
  end;

  constructor() {
    const previouslyGrabbedRaids = JSON.parse(localStorage.getItem("raids")) ?? [];
    this.parsesByRaider = JSON.parse(localStorage.getItem("parses")) ?? {};

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
      const raidsById = {};

      Object.values(response).forEach((raid) => {
        const duration = raid.end - raid.start;

        if (duration > 0) {
          const dayOfWeek = new Date(raid.start).getDay();
          raidsById[raid.id] = raid;
          if (raid.start > raidCutoff && (dayOfWeek === Wednesday || dayOfWeek === Thursday) && raid.zone === 1002) {
            this.raidsToGetFightsFor.push(raid.id);
          }
        }
      });

      let needToGetData = false;

      this.raidsToGetFightsFor.forEach((id) => {
        if (!previouslyGrabbedRaids.includes(id)) {
          needToGetData = true;
        }
      });

      console.log(needToGetData);
      if (needToGetData) {
        const requests = [];
        this.raidsToGetFightsFor.forEach((raidId) => {
          requests.push(request({ url: `/report/fights/${raidId}` }));
        });

        axios.all(requests).then(
          axios.spread((...responses) => {
            const fightsToGetRaidersFrom = [];
            Object.values(raidsById).forEach((raid) => {
              responses.forEach((response) => {
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

                        response.forEach((encounter) => {
                          const { bracket } = this.parsesByRaider[name];
                          if (!bracket[encounter.encounterID]) {
                            bracket[encounter.encounterID] = {
                              best: 0,
                              parses: [],
                            };
                          }

                          if (encounter.startTime > parseCutoff) {
                            bracket[encounter.encounterID].parses.push(encounter.percentile);
                          }

                          if (bracket[encounter.encounterID].best < encounter.percentile) {
                            bracket[encounter.encounterID].best = encounter.percentile;
                          }
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

                        response.forEach((encounter) => {
                          const { overall } = this.parsesByRaider[name];
                          if (!overall[encounter.encounterID]) {
                            overall[encounter.encounterID] = {
                              best: 0,
                              parses: [],
                            };
                          }

                          if (encounter.startTime > parseCutoff) {
                            overall[encounter.encounterID].parses.push(encounter.percentile);
                          }

                          if (overall[encounter.encounterID].best < encounter.percentile) {
                            overall[encounter.encounterID].best = encounter.percentile;
                          }
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
      } else {
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

        const raiders = Object.keys(this.parsesByRaider).sort();
        raiders.forEach((raider) => {
          const bestBracketRow = { name: raider };
          const medianBracketRow = { name: raider };
          const bestOverallRow = { name: raider };
          const medianOverallRow = { name: raider };

          const { bracket } = this.parsesByRaider[raider];
          if (bracket) {
            Object.keys(bracket).forEach((bossKey) => {
              const boss = bracket[bossKey];
              let average = 0;
              boss.parses.forEach((percentile) => {
                average += percentile;
              });
              average /= boss.parses.length;
              bestBracketRow[bossKey] = Number.isInteger(boss.best) ? boss.best : boss.best.toFixed(2);
              medianBracketRow[bossKey] = Number.isInteger(average) ? average : average.toFixed(2);
            });
          }

          const { overall } = this.parsesByRaider[raider];
          if (overall) {
            Object.keys(overall).forEach((bossKey) => {
              const boss = overall[bossKey];
              let average = 0;
              boss.parses.forEach((percentile) => {
                average += percentile;
              });
              average /= boss.parses.length;
              bestOverallRow[bossKey] = Number.isInteger(boss.best) ? boss.best : boss.best.toFixed(2);
              medianOverallRow[bossKey] = Number.isInteger(average) ? average : average.toFixed(2);
            });
          }

          this.bestBracket.push(bestBracketRow);
          this.medianBracket.push(medianBracketRow);
          this.bestOverall.push(bestOverallRow);
          this.medianOverall.push(medianOverallRow);
        });

        this.loading = false;
        localStorage.setItem("raids", JSON.stringify(this.raidsToGetFightsFor));
        localStorage.setItem("parses", JSON.stringify(this.parsesByRaider));
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
