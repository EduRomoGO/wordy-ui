import React from "react";

// import fileNamesJson from "utils/db/divided/file-names";

// // first one is already loaded, hence we don't put it here as pending
// const [, ...pendingPartsDefault] = fileNamesJson.fileNames.slice(0, 5);

// console.log(pendingPartsDefault);

const DatabaseLoadStatusContext = React.createContext({
  loadStatus: "empty",
  setLoadStatus: () => {},
});

DatabaseLoadStatusContext.displayName = "DatabaseLoadStatusContext";

function useDatabaseLoadStatusContext() {
  const context = React.useContext(DatabaseLoadStatusContext);

  return context;
}

function DatabaseLoadStatusProvider({ children }) {
  const [loadStatus, updateLoadStatus] = React.useState(
    () => localStorage.getItem("loadStatus") || "empty"
  );

  const setLoadStatus = function (newStatus) {
    localStorage.setItem("loadStatus", newStatus);
    updateLoadStatus(newStatus);
  };

  const value = {
    loadStatus,
    setLoadStatus,
  };

  return (
    <DatabaseLoadStatusContext.Provider value={value}>
      {children}
    </DatabaseLoadStatusContext.Provider>
  );
}

export { DatabaseLoadStatusProvider, useDatabaseLoadStatusContext };
