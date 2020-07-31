import { decorate, observable, reaction } from "mobx";
import axios from "axios";
import request from "services/request";

const weekInNanoSeconds = 7 * 24 * 60 * 60 * 1000;
const requestDelay = 2000;

class RaidsStore {
  raidsToGetFightsFor = [];
  parsesByRaider = {};
  zones = {};

  loading = true;
  loadingBracketParses = true;
  loadingOverallParses = true;
  loadingZones = true;
  needToGetData = false;
  error = "";
  timeRemaining = 0;

  medianBracket = [];
  bestBracket = [];
  medianOverall = [];
  bestOverall = [];

  healerTypes = ["Priest", "Paladin", "Druid"];
  healerExclusionList = ["Lightsaber", "Neku", "Taede"];
  healers = [];
  start;

  getZoneId(zoneName) {
    return this.zones.find((z) => z.name === zoneName).id;
  }

  /**
   * Checks local storage to see if last seen raid data is up to date.
   * If it's up to date this returns false otherwise true.
   */
  isRaidDataOutOfDate = () => {
    const lastSeenRaids = JSON.parse(localStorage.getItem("previousRaids"));
    let needToGetData = false;

    if (!lastSeenRaids && this.raidsToGetFightsFor.length > 0) {
      needToGetData = true;
    } else {
      this.raidsToGetFightsFor.forEach((id) => {
        if (!lastSeenRaids.includes(id)) {
          needToGetData = true;
        }
      });
    }

    return needToGetData;
  };

  /**
   * Finds all the raids that match the supplied zone that occured in the
   * specified timeframe.
   * @param {array<object>} raids - the collection of all raids
   * @param {string} zone - raids matching this zone
   * @param {number} timeFrameInWeeks - number of weeks to look for raid data in
   */
  findRaids = (raids, zone, timeFrameInWeeks) => {
    return raids
      .filter(
        (raid) => raid.start > Date.now() - timeFrameInWeeks * weekInNanoSeconds && raid.zone === this.getZoneId(zone)
      )
      .map((raid) => raid.id);
  };

  /**
   * Finds all the raiders from the collection of raid responses
   * @param {array<object>} responses - array of multiple server responses
   */
  findRaiders = (responses) => {
    const raidFights = [];
    this.raids.forEach((raid) => {
      responses.forEach((response) => {
        if (raid.start === response.start && raid.title === response.title) {
          raidFights.push(response);
        }
      });
    });

    raidFights.forEach((fight) => {
      fight.exportedCharacters.forEach((char) => {
        const friendlyData = fight.friendlies.find((e) => e.name === char.name);
        if (
          this.healerTypes.includes(friendlyData.type) &&
          !this.healerExclusionList.includes(friendlyData.name) &&
          !this.healers.includes(friendlyData.name)
        ) {
          this.healers.push(friendlyData.name);
        }
        this.parsesByRaider[char.name] = {};
      });
    });
  };

  constructor() {
    this.parsesByRaider = JSON.parse(localStorage.getItem("parsesByRaider")) ?? {};

    this.start = Date.now();
    const parseCutoff = this.start - 6 * weekInNanoSeconds;

    request({ url: "/zones" }).then((response) => {
      this.zones = response;
      this.loadingZones = false;
    });

    // once we have zone data
    reaction(
      () => this.loadingZones,
      () => {
        request({
          url: "/reports/guild/RIVAL/Fairbanks/US",
        }).then((response) => {
          this.raids = response;
          this.raidsToGetFightsFor = this.findRaids(response, "Temple of Ahn'Qiraj", 4);
          this.needToGetData = this.isRaidDataOutOfDate();

          if (!this.needToGetData) {
            this.loadingBracketParses = false;
            this.loadingOverallParses = false;
          }
        });
      }
    );

    // if raid data needs to be grabbed
    reaction(
      () => this.needToGetData,
      () => {
        const requests = [];
        this.raidsToGetFightsFor.forEach((raidId) => {
          requests.push(request({ url: `/report/fights/${raidId}` }));
        });

        axios.all(requests).then(
          axios.spread((...responses) => {
            this.findRaiders(responses);

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
                    params: {
                      bracket: -1,
                      zone: this.getZoneId("Temple of Ahn'Qiraj"),
                      metric: this.healers.includes(raiders[0]) ? "hps" : "dps",
                    },
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
                    zone: this.getZoneId("Temple of Ahn'Qiraj"),
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
      }
    );
  }

  updateWhenFinished = reaction(
    () => this.loadingBracketParses || this.loadingOverallParses || this.loadingZones,
    () => {
      if (!this.loadingBracketParses && !this.loadingOverallParses && !this.loadingZones) {
        console.log(`done loading, time elapsed: ${(Date.now() - this.start) / 1000}s`);

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
              medianBracketRow[bossKey] = Number.isNaN(average)
                ? "-"
                : Number.isInteger(average)
                ? average
                : average.toFixed(2);
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
              medianOverallRow[bossKey] = Number.isNaN(average)
                ? "-"
                : Number.isInteger(average)
                ? average
                : average.toFixed(2);
            });
          }

          this.bestBracket.push(bestBracketRow);
          this.medianBracket.push(medianBracketRow);
          this.bestOverall.push(bestOverallRow);
          this.medianOverall.push(medianOverallRow);
        });

        this.loading = false;
        localStorage.setItem("previousRaids", JSON.stringify(this.raidsToGetFightsFor));
        localStorage.setItem("parsesByRaider", JSON.stringify(this.parsesByRaider));
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
  needToGetData: observable,
  timeRemaining: observable,
  loadingZones: observable,
  bestBracket: observable,
  medianBracket: observable,
  bestOverall: observable,
  medianOverall: observable,
});

export default RaidsStore;
