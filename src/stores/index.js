import React from "react";
import ZoneStore from "./zonesStore";
import RaidsStore from "./raidsStore";

export const storesContext = React.createContext({
  zoneStore: new ZoneStore(),
  raidStore: new RaidsStore(),
});
