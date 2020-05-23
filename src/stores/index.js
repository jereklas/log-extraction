import React from "react";
import RaidsStore from "./raidsStore";

export const storesContext = React.createContext({
  raidStore: new RaidsStore(),
});
