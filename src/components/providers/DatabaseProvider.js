/** @jsx jsx */
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import React, { useState, useEffect } from "react";
import BounceLoader from "react-spinners/BounceLoader";
// import { loadPendingParts } from "utils/db/workerizedLoadAll";
import { loadPendingParts } from "utils/db/load-all";

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

// Database helper methods

const createOrOpenDb = () => {
  const db = new window.PouchDB("wordsDB");
  console.log(`Opened connection to db ${db.name} using adapter ${db.adapter}`);

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
    .bulkDocs(data)
    .then(function (result) {
      console.log(
        `${result.length} documents were added to ${db.name} database`
      );
      console.log(result);
    })
    .catch(function (error) {
      console.log(`Error populating database - ${error}`);
    });
};

// const initialPendingParts = ["db-2.json", "db-3.json", "db-4.json"];

function DatabaseProvider({ children }) {
  const [db, setDb] = useState();
  const [status, setStatus] = useState("idle");
  const [fullyLoaded, setFullyLoaded] = useState(false);
  // const [pendingParts, setPendingParts] = useState(initialPendingParts);

  // const progressPerc =
  //   Math.floor(1 - pendingParts.length / initialPendingParts.length) * 100;

  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const db = createOrOpenDb();

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
      const db = createOrOpenDb();

      db.close();
    };
  }, []);

  useEffect(() => {
    const asyncWrapper = async () => {
      const failedPendingParts = await loadPendingParts();
      if (failedPendingParts.length > 0) {
        await loadPendingParts(failedPendingParts);
        setFullyLoaded(true);
      }

      setFullyLoaded(true);
    };

    if (!fullyLoaded) {
      asyncWrapper();
    }
  }, [fullyLoaded]);

  // useEffect(() => {
  //   async function test() {
  //     const db = new window.PouchDB("test");

  //     const allDocs = await db.allDocs({
  //       include_docs: true,
  //     });

  //     console.log(allDocs);

  //     // const pendingParts = allDocs.rows.map((row) => {
  //     //   return row?.doc?.name;
  //     // });
  //   }
  //   test();

  //   // asyncWrapper();
  // }, []);

  // useEffect(() => {
  //   const loadPendingParts = async () => {
  //     try {
  //       const db = createOrOpenDb();

  //       const dbDocsCount = await checkDb(db);
  //       console.log("dbDocsCount");
  //       console.log(dbDocsCount);

  //       if (dbDocsCount < 3500 && pendingParts.length > 0) {
  //         let failedParts = [];

  //         pendingParts.forEach(async (part) => {
  //           try {
  //             const loadFromDiskResult = await import(
  //               `../../utils/db/divided/${part}`
  //             );

  //             console.log("loadFromDiskResult");
  //             console.log(loadFromDiskResult.wordDescriptors);

  //             await populate(db, loadFromDiskResult.wordDescriptors);
  //           } catch (error) {
  //             failedParts.push(part);
  //             console.error(
  //               `Error loading all the data to database - ${error}`
  //             );
  //           }
  //         });

  //         setPendingParts(failedParts);
  //       }
  //     } catch (error) {
  //       console.error(`Error loading all database - ${error}`);
  //     }
  //   };

  //   loadPendingParts();
  // }, [pendingParts]);

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
      {fullyLoaded ? (
        <div>Database is fully updated</div>
      ) : (
        <div>database loading in progress</div>
      )}
      {children}
    </DatabaseContext.Provider>
  );
}

export { DatabaseProvider, useDatabaseContext };
