/** @jsx jsx */

import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import React, { useState, useEffect, useCallback } from "react";
import BounceLoader from "react-spinners/BounceLoader";
import PouchDB from "pouchdb-browser";
import Find from "pouchdb-find";

PouchDB.plugin(Find);

const DatabaseContext = React.createContext({});
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
//   console.info(`Opened connection to db ${db.name} using adapter ${db.adapter}`);

//   return db;
// };

// TODO: Replace previous definition with this one
const createOrOpenDb = () => {
  const db = new PouchDB("wordsDB");
  console.info(`Opened connection to db ${db.name}`);

  return db;
};

function DatabaseProvider({ children }: { children: any }) {
  const [db, setDb] = useState();

  useEffect(() => {
    let db: any;
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

  const getSomeWords = useCallback(
    async (numberOfWords) => {
      try {
        // throw new Error("💥 CABOOM 💥");
        if (db !== undefined) {
          const allDocs = await (db as any).allDocs({
            include_docs: true,
            limit: numberOfWords,
          });
          const parsedWords = allDocs.rows.map((n: any) => {
            return {
              word: n.doc.word,
              phonemics: n.doc.phonemics,
            };
          });

          return parsedWords;
        } else {
          return [];
        }
      } catch (error) {
        console.error(`Error reading docs: ${error}`);
        return Promise.reject(error);
      }
    },
    [db]
  );

  const getDefinition = useCallback(
    async (word) => {
      if (db) {
        try {
          const wordDescriptor = await (db as any).find({
            selector: { word },
            fields: ["definitions"],
          });

          return wordDescriptor.docs[0].definitions[0].defs[0].def;
        } catch (error) {
          console.error(`Error finding descriptor for word ${word}`);
        }
      }
    },
    [db]
  );

  const getDescriptorsForWords = useCallback(
    async (words) => {
      if (db) {
        const queries = words.map((word: any) => {
          return (db as any).find({
            selector: { word },
            fields: ["phonemics", "word"],
          });
        });

        const queriesResults = await Promise.allSettled(queries);

        const inputWordsDescriptors = queriesResults.reduce(
          // @ts-ignore
          (acc, queryResult) => {
            return queryResult.status === "fulfilled" &&
              queryResult.value.docs.length > 0
              ? [...acc, queryResult.value.docs[0]]
              : acc;
          },
          []
        );

        return inputWordsDescriptors;
      }
    },
    [db]
  );

  const populate = (db: any, data: any) => {
    return db
      .bulkDocs(data)
      .then(function (result: any) {
        console.info(
          `${result.length} documents were added to ${db.name} database`
        );
        // console.info(result);
      })
      .catch(function (error: any) {
        console.error(`Error populating database - ${error}`);
      });
  };

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

  if (db) {
    const value = {
      getSomeWords,
      getDefinition,
      getDescriptorsForWords,
      populate,
      db,
    };

    return (
      <DatabaseContext.Provider value={value}>
        {children}
      </DatabaseContext.Provider>
    );
  }
}

export { DatabaseProvider, useDatabaseContext };
