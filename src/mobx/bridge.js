import React from "react";

export const rootContext = React.createContext();

export const useRootStore = () => React.useContext(rootContext);
