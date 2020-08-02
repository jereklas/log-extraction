import React from "react";
import { observer } from "mobx-react";
import { useStores } from "hooks/useStores";

const App = observer(() => {
  const { raidStore } = useStores();

  const getParseColor = (value) => {
    let color = "black";
    if (value === 100) {
      color = "#F4D03F";
    } else if (value >= 95 && value < 100) {
      color = "#F39C12";
    } else if (value >= 75 && value < 95) {
      color = "#8E44AD";
    } else if (value >= 50 && value < 75) {
      color = "#3498DB";
    } else if (value >= 25 && value < 50) {
      color = "#2ECC71";
    } else if (value >= 0 && value < 25) {
      color = "#BDC3C7";
    }
    return color;
  };

  const generateTable = (data) => {
    const zone = raidStore.getZone();

    // generate header row
    const headers = ["Raider", "Average"];
    zone.encounters.forEach((encounter) => {
      headers.push(encounter.name);
    });

    const rows = [];
    data.forEach((raider) => {
      const row = [raider.name];
      const encounters = [];
      let avg = 0;
      let count = 0;
      zone.encounters.forEach((encounter) => {
        const value = raider[encounter.id] ?? "-";

        if (value && value !== "-") {
          avg += Number(value);
          count += 1;
        }

        encounters.push(value);
      });

      if (avg !== 0) {
        row.push((avg / count).toFixed(2));
      } else {
        row.push("-");
      }

      encounters.forEach((encounter) => row.push(encounter));
      rows.push(row);
    });

    return (
      <table style={{ borderCollapse: "collapse", margin: "3px 5px" }}>
        <thead>
          <tr>
            {headers.map((d) => (
              <th
                key={d}
                style={{
                  padding: "5px",
                  textAlign: "left",
                  fontWeight: "bold",
                  backgroundColor: "#5D6D7E",
                  color: "white",
                  border: "1px solid black",
                }}
              >
                {d}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr>
              {row.map((d) => (
                <td style={{ padding: "0px 5px", border: "1px solid black", color: `${getParseColor(d)}` }}>{d}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      {raidStore.loading ? (
        <div>
          <p style={{ margin: "5px" }}>Due to WarcraftLog's API request limit, loading will take about 2 minutes.</p>
          {raidStore.timeRemaining > 0 && (
            <p style={{ margin: "5px" }}>{`Estimated time remaining: ${raidStore.timeRemaining}s`}</p>
          )}
        </div>
      ) : raidStore.error !== "" ? (
        `ERROR: ${raidStore.error}`
      ) : (
        <div>
          <p style={{ margin: "5px 0px 5px 5px" }}>
            <b>Zone:</b>
            {` ${raidStore.getZone().name}`}
          </p>
          <p style={{ margin: "0px 5px" }}>
            <b>Partition:</b>
            {` ${raidStore.getPartitionName()}`}
          </p>
          <p style={{ margin: "5px" }}>
            <b>Details:</b>
            {` Druids, Paladins, and Priests have healing parses pulled. The following people are excluded from that: ${raidStore.healerExclusionList
              .sort()
              .join(", ")}`}
          </p>
          <p style={{ margin: "15px 5px 7px 5px" }}>
            <b>Median Bracket:</b>
          </p>
          {generateTable(raidStore.medianBracket)}
          <p style={{ margin: "7px 5px" }}>
            <b>Best Bracket:</b>
          </p>
          {generateTable(raidStore.bestBracket)}
          <p style={{ margin: "7px 5px" }}>
            <b>Median Overall:</b>
          </p>
          {generateTable(raidStore.medianOverall)}
          <p style={{ margin: "7px 5px" }}>
            <b>Best Overall:</b>
          </p>
          {generateTable(raidStore.bestOverall)}
        </div>
      )}
    </div>
  );
});

export default App;
