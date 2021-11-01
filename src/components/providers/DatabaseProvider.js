import React, { useState, useEffect } from "react";

const DatabaseContext = React.createContext();
DatabaseContext.displayName = "DatabaseContext";

function useDatabaseContext() {
  const context = React.useContext(DatabaseContext);

  // Logging here instead of throwing an error since the context value is async and not
  // having context could mean that the content is not ready yet or that it has been
  // used outside of a provider
  if (!context) {
    console.warn("useDatabaseState must be used within the DatabaseProvider");
  } else {
    console.info("useDatabaseState was used within DatabaseProvider");
  }

  return context;
}

function DatabaseProvider({ children }) {
  const [db, setDb] = useState();

  const parseDescriptors = (db) => {
    return db?.wordDescriptors.map((item) => ({
      word: item.word,
      phonemics: item.phonemics,
    }));
  };

  const parsedDescriptors = React.useMemo(() => parseDescriptors(db), [db]);

  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const data = await import(
          // TODO: Cambiar a db.json cuando termine de probar en dev
          /* webpackPrefetch: true */ "../../utils/db/db-test.json"
        );
        setDb(data);
      } catch (error) {
        throw new Error(`Error loading database ${error}`);
      }
    };

    loadDatabase();
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, parsedDescriptors }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export { DatabaseProvider, useDatabaseContext };
