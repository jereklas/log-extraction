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
    const bwl = raidStore.zones.find((zone) => zone.id === 1002);
    // generate header row
    const headers = ["Raider", "Average"];
    bwl.encounters.forEach((encounter) => {
      headers.push(encounter.name);
    });

    const rows = [];
    data.forEach((raider) => {
      const row = [raider.name];
      const encounters = [];
      let avg = 0;
      let count = 0;
      bwl.encounters.forEach((encounter) => {
        const value = raider[encounter.id];

        if (value && value !== "-") {
          avg += Number(value);
          count += 1;
        }
        encounters.push(value ?? "-");
      });

      if (avg !== 0) {
        row.push((avg / count).toFixed(2));
        encounters.forEach((encounter) => row.push(encounter));
        rows.push(row);
      }
    });

    return (
      <table style={{ borderCollapse: "collapse" }}>
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
          <p
            style={{ margin: "5px" }}
          >{`Druids, Paladins, and Priests have healing parses pulled. The following people are excluded from that: ${raidStore.healerExclusionList
            .sort()
            .join(", ")}`}</p>
          <br />
          <p style={{ margin: "5px" }}>Median Bracket:</p>
          {generateTable(raidStore.medianBracket)}
          <p>Best Bracket:</p>
          {generateTable(raidStore.bestBracket)}
          <p>Median Overall:</p>
          {generateTable(raidStore.medianOverall)}
          <p>Best Overall:</p>
          {generateTable(raidStore.bestOverall)}
        </div>
      )}
    </div>
  );
});

export default App;
