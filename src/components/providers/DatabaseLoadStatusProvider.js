import React from "react";

import fileNamesJson from "utils/db/divided/file-names";

// first one is already loaded, hence we don't put it here as pending
const [, ...jsonParts] = fileNamesJson.fileNames.slice(0, 5);

console.log(jsonParts);

const DatabaseLoadStatusContext = React.createContext({
  loadStatus: "empty",
  updateLoadStatus: () => {},
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

// const getMissingParts = () => {
//   return jsonParts.filter(
//     (part) => !getLoadedParts().includes(part)
//   );
// }

function DatabaseLoadStatusProvider({ children }) {
  const [loadStatus, setLoadStatus] = React.useState(getLoadStatus);

  const updateLoadStatus = (part) => {
    const loadedParts = getLoadedParts();

    localStorage.setItem("loadedParts", JSON.stringify([...loadedParts, part]));

    setLoadStatus(getLoadStatus());
  };

  const value = {
    loadStatus,
    getLoadedParts,
    updateLoadStatus,
  };

  return (
    <DatabaseLoadStatusContext.Provider value={value}>
      {children}
    </DatabaseLoadStatusContext.Provider>
  );
}

export { DatabaseLoadStatusProvider, useDatabaseLoadStatusContext };
