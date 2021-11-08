import React from "react";

import fileNamesJson from "utils/db/divided/file-names";

// first one is already loaded, hence we don't put it here as pending
const [, ...jsonParts] = fileNamesJson.fileNames.slice(0, 5);

console.log(jsonParts);

const DatabaseLoadStatusContext = React.createContext({
  loadStatus: "empty",
  updateLoadedParts: () => {},
});

DatabaseLoadStatusContext.displayName = "DatabaseLoadStatusContext";

function useDatabaseLoadStatusContext() {
  const context = React.useContext(DatabaseLoadStatusContext);

  return context;
}

const getLoadStatus = (loadedParts) => {
  const allPartsAreLoaded = jsonParts.every((part) => {
    return loadedParts.includes(part);
  });

  return allPartsAreLoaded ? "fullyLoaded" : "empty";
};

const getMissingParts = (loadedParts) => {
  return jsonParts.filter((part) => {
    return !loadedParts.includes(part);
  });
};

function DatabaseLoadStatusProvider({ children }) {
  const [loadedParts, setLoadedParts] = React.useState(
    () => JSON.parse(localStorage.getItem("loadedParts")) || []
  );

  const loadStatus = getLoadStatus(loadedParts);
  const missingParts = getMissingParts(loadedParts);

  React.useEffect(() => {
    localStorage.setItem("loadedParts", JSON.stringify(loadedParts));
  }, [loadedParts]);

  const updateLoadedParts = React.useCallback((parts) => {
    setLoadedParts((loadedParts) => [...loadedParts, ...parts]);
  }, []);

  const value = {
    loadStatus,
    missingParts,
    updateLoadedParts,
  };

  return (
    <DatabaseLoadStatusContext.Provider value={value}>
      {children}
    </DatabaseLoadStatusContext.Provider>
  );
}

export { DatabaseLoadStatusProvider, useDatabaseLoadStatusContext };
