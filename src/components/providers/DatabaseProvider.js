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

// const createOrOpenDb = async () => {
//   let db = new window.PouchDB("wordsDB");
//   await db.destroy();
//   db = new window.PouchDB("wordsDB");
//   console.log(`Opened connection to db ${db.name} using adapter ${db.adapter}`);

//   return db;
// };

// TODO: Replace previous definition with this one
const createOrOpenDb = () => {
  const db = new window.PouchDB("wordsDB");
  console.log(`Opened connection to db ${db.name} using adapter ${db.adapter}`);

  return db;
};

function DatabaseProvider({ children }) {
  const [db, setDb] = useState();

  useEffect(() => {
    let db;
    const createAndConfigurateDb = async () => {
      try {
        db = createOrOpenDb();
        // db = await createOrOpenDb();

        await db.createIndex({
          index: { fields: ["word"] },
        });

        setDb(db);
      } catch (error) {
        throw new Error(`Imposible to connect to db - ${error}`);
      }
    };

    createAndConfigurateDb();

    return () => {
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

  if (!db) {
    return (
      <Frame>
        <BounceLoader color="#ff0000" loading={true} speedMultiplier={0.8} />
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
