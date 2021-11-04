/** @jsx jsx */
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import React, { useState, useEffect } from "react";
import BounceLoader from "react-spinners/BounceLoader";

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

  const createOrOpenDb = () => {
    const db = new window.PouchDB("wordsDB");
    console.log(
      `Opened connection to db ${db.name} using adapter ${db.adapter}`
    );

    return db;
  };

  const checkDb = async (db) => {
    try {
      const dbInfo = await db.info();

      return dbInfo.doc_count;
    } catch (error) {
      console.log(error);
    }
  };

  const populate = (db, data) => {
    return db
      .bulkDocs(data.wordDescriptors)
      .then(function (result) {
        console.log(
          `${result.length} documents were added to ${db.name} database`
        );
        console.log(result);
      })
      .catch(function (err) {
        console.log(`Error populating database`);
      });
  };

  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const db = createOrOpenDb();

        const dbDocsCount = await checkDb(db);

        if (dbDocsCount > 0) {
          setStatus("resolved");
          setDb(db);
        } else {
          const data = await import(
            /* webpackPrefetch: true */ "../../utils/db/db.json"
          );

          await populate(db, data);

          await db.createIndex({
            index: { fields: ["word"] },
          });

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
      const db = createOrOpenDb();

      db.close();
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
        <div>Loading database. This may take a couple of minutes</div>
        <div>All the reloads after this first load will be very fast</div>

        <BounceLoader color="#ff0000" loading={true} speedMultiplier={0.8} />
      </Frame>
    );
  }

  if (status === "rejected") {
    return (
      <Frame>
        <div>Ha ocurrido un error</div>
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
