import React from "react";

import fileNamesJson from "utils/db/divided/file-names";

// first one is already loaded, hence we don't put it here as pending
const [, ...jsonParts] = fileNamesJson.fileNames.slice(0, 5);

console.log(jsonParts);

const DatabaseLoadStatusContext = React.createContext({
  loadStatus: "empty",
  setLoadStatus: () => {},
});

DatabaseLoadStatusContext.displayName = "DatabaseLoadStatusContext";

function useDatabaseLoadStatusContext() {
  const context = React.useContext(DatabaseLoadStatusContext);

  return context;
}

const getLoadedParts = () => {
  const loadedPartsStorage = localStorage.getItem("loadedParts");

  return loadedPartsStorage ? JSON.parse(loadedPartsStorage) : [];
};

const getLoadStatus = () => {
  const loadedParts = getLoadedParts();

  const allPartsAreLoaded = jsonParts.every((part) => {
    return loadedParts.includes(part);
  });

  return allPartsAreLoaded ? "fullyLoaded" : "empty";
};

function DatabaseLoadStatusProvider({ children }) {
  const [loadStatus, updateLoadStatus] = React.useState(getLoadStatus);

  const setLoadStatus = (part) => {
    const loadedParts = getLoadedParts();

    localStorage.setItem("loadedParts", JSON.stringify([...loadedParts, part]));

    updateLoadStatus(getLoadStatus());
  };

  const value = {
    loadStatus,
    getLoadedParts,
    setLoadStatus,
  };

  return (
    <DatabaseLoadStatusContext.Provider value={value}>
      {children}
    </DatabaseLoadStatusContext.Provider>
  );
}

export { DatabaseLoadStatusProvider, useDatabaseLoadStatusContext };
