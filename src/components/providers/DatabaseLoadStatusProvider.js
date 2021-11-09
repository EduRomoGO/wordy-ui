import React from "react";

import fileNamesJson from "utils/db/divided/file-names";

const initialPendingParts = fileNamesJson.fileNames.slice(0, 5);

// console.log(initialPendingParts);

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
  const allPartsAreLoaded = initialPendingParts.every((part) => {
    return loadedParts.includes(part);
  });

  return allPartsAreLoaded ? "fullyLoaded" : "empty";
};

const getPendingParts = (loadedParts) => {
  return initialPendingParts.filter((part) => {
    return !loadedParts.includes(part);
  });
};

function DatabaseLoadStatusProvider({ children }) {
  const [loadedParts, setLoadedParts] = React.useState(
    () => JSON.parse(localStorage.getItem("loadedParts")) || []
  );

  const loadStatus = getLoadStatus(loadedParts);
  const pendingParts = getPendingParts(loadedParts);

  React.useEffect(() => {
    localStorage.setItem("loadedParts", JSON.stringify(loadedParts));
  }, [loadedParts]);

  const updateLoadedParts = React.useCallback((parts) => {
    setLoadedParts((loadedParts) => [...loadedParts, ...parts]);
  }, []);

  const value = {
    loadStatus,
    pendingParts,
    updateLoadedParts,
  };

  return (
    <DatabaseLoadStatusContext.Provider value={value}>
      {children}
    </DatabaseLoadStatusContext.Provider>
  );
}

export { DatabaseLoadStatusProvider, useDatabaseLoadStatusContext };
