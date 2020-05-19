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

// const populateRaids =  async () => {
//   const res =  await request({
//     url: '/reports/guild/RIVAL/Fairbanks/US',
//     // url: '/report/fights/za4DHnM91BvyhkPr',
//     // url: '/reports/user/Ragemonster',
//     // url: '/rankings/character/Ragemonster/Fairbanks/US',
//   });

//     Object.values(res).forEach(raid => {
//       raidsById[raid.id] = raid;
//     });
// }

const App = observer(() => {
  const classes = useStyles();
  const { raidStore, zoneStore } = useStores();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div
        style={{
          width: "300px",
          overflow: "auto",
          borderRight: "2px solid black",
        }}
      >
        <p
          style={{
            fontWeight: "bold",
            margin: "5px 20px",
            borderBottom: "2px solid black",
          }}
        >
          Raids:
        </p>
        <ul
          style={{
            cursor: "pointer",
            listStyle: "none",
            margin: "0px",
            padding: "0px 20px",
          }}
        >
          {raidStore.raids.map((raid) => (
            <li
              key={raid.id}
              className={`${classes.li}${
                raid.id === raidStore.activeRaid.id ? " selected" : ""
              }`}
              onClick={() => raidStore.setActiveRaid(raid.id)}
            >
              {raid.title}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ padding: "5px 20px" }}>
        <p className={classes.p}>
          <b>Raid:</b> {raidStore.activeRaid.title}
        </p>
        <p className={classes.p}>
          <b>Date:</b> {new Date(raidStore.activeRaid.start).toDateString()}
        </p>
        <p className={classes.p}>
          <b>Instance:</b> {zoneStore.getZoneName(raidStore.activeRaid.zone)}
        </p>
        <p className={classes.p}>
          <b>Owner:</b> {raidStore.activeRaid.owner}
        </p>
        <p className={classes.p}>
          <b>Duration:</b> {raidStore.activeRaid.duration}
        </p>
        {raidStore.activeRaid.fightData && (
          <p>Fights: {raidStore.activeRaid.fightData.fights.length}</p>
        )}
      </div>
    </div>
  );
});

export default App;
