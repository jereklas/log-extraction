import React from "react";
import { makeStyles } from "@material-ui/styles";
import { observer } from "mobx-react";
import { useStores } from "hooks/useStores";

const useStyles = makeStyles({
  li: {
    padding: "2px 0px",
    "&.selected:hover": {
      backgroundColor: "#85929E",
    },
    "&.selected:active": {
      backgroundColor: "#5D6D7E",
    },
    "&.selected": {
      backgroundColor: "#AEB6BF",
    },
    "&:hover": {
      backgroundColor: "#EBEDEF",
    },
    "&:active": {
      backgroundColor: "#D6DBDF",
    },
  },
  p: {
    margin: "2px 0px",
  },
});

const App = observer(() => {
  const classes = useStyles();
  const { raidStore, zoneStore } = useStores();

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
    const headers = ["Raider"];
    bwl.encounters.forEach((encounter) => {
      headers.push(encounter.name);
    });

    const rows = [];
    data.forEach((raider) => {
      const row = [raider.name];
      bwl.encounters.forEach((encounter) => {
        row.push(raider[encounter.id] ?? "-");
      });
      rows.push(row);
    });

    return (
      <table style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {headers.map((d) => (
              <th
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
    console.log(headers);
    console.log(rows);
  };

  return (
    <div>
      {raidStore.loading ? (
        "Loading..."
      ) : (
        <div>
          <h1>Median Bracket:</h1>
          {generateTable(raidStore.medianBracket)}
          <h1>Best Bracket:</h1>
          {generateTable(raidStore.bestBracket)}
          <h1>Median Overall:</h1>
          {generateTable(raidStore.medianOverall)}
          <h1>Best Overall:</h1>
          {generateTable(raidStore.bestOverall)}
        </div>
      )}
    </div>
  );
});

export default App;
