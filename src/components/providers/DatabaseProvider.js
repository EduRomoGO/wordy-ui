/** @jsx jsx */
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import React, { useState, useEffect } from "react";
import BounceLoader from "react-spinners/BounceLoader";
import { createOrOpenDb, populate, checkDb } from "utils/db/db-helpers";

const DatabaseContext = React.createContext();
DatabaseContext.displayName = "DatabaseContext";

function useDatabaseContext() {
  const context = React.useContext(DatabaseContext);

  // Logging here instead of throwing an error since the context value is async and not
  // having context could mean that the content is not ready yet or that it has been
  // used outside of a provider
  // if (!context) {
  //   console.warn("useDatabaseState must be used within the DatabaseProvider");
  // } else {
  //   console.info("useDatabaseState was used within DatabaseProvider");
  // }

  return context;
}

function DatabaseProvider({ children }) {
  const [db, setDb] = useState();
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const db = await createOrOpenDb();

        const dbDocsCount = await checkDb(db);

        if (dbDocsCount > 0) {
          setStatus("resolved");
          setDb(db);
        } else {
          // /* webpackPrefetch: true */ "../../utils/db/db.json"
          const data = await import(
            /* webpackPrefetch: true */ "../../utils/db/divided/db-1.json"
          );

          await populate(db, data.wordDescriptors);

          await db.createIndex({
            index: { fields: ["word"] },
          });

          setStatus("resolved");
          setDb(db);
        }
      } catch (error) {
        setStatus("rejected");
        console.error(`Error loading database ${error}`);
      }
    };

    setStatus("loading");
    loadDatabase();

    return () => {
      // const db = createOrOpenDb();
      // db.close();
    };
  }, []);

  const Frame = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `;

  if (status === "loading" || status === "idle") {
    return (
      <Frame>
        <BounceLoader color="#ff0000" loading={true} speedMultiplier={0.8} />
      </Frame>
    );
  }

  if (status === "rejected") {
    return (
      <Frame>
        <div>There has been an error. Please try again later</div>
      </Frame>
    );
  }

  return (
    <DatabaseContext.Provider value={{ db }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export { DatabaseProvider, useDatabaseContext };
