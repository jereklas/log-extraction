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
        if (value) {
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
        "Loading... Depending on WarcraftLogs this can take 5 seconds or 1 minute. Be Patient :)"
      ) : raidStore.error !== "" ? (
        `ERROR: ${raidStore.error}`
      ) : (
        <div>
          <div style={{ margin: "5px", width: "600px" }}>
            This is currently finding everyone who has raided BWL in the past 4 weeks, and then taking their last 6
            weeks of BWL parses to populate the tables. If someone only has 3 weeks of parse data, then their median is
            based on the 3 weeks of data available instead of 6. I wasn't able to find a good way to determine when to
            grab healing parses, so I currently have a list of healers. If we get new healers, or someone is no longer a
            healer that list will have to be updated.
          </div>
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
