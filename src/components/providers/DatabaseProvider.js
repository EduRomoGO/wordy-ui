/** @jsx jsx */
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import React, { useState, useEffect, useCallback } from "react";
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

  const getSomeWords = useCallback(
    async (numberOfWords) => {
      try {
        if (db) {
          const allDocs = await db.allDocs({
            include_docs: true,
            limit: numberOfWords,
          });
          const parsedWords = allDocs.rows.map((n) => {
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
        console.log(`Error reading docs: ${error}`);
        return Promise.reject(error);
      }
    },
    [db]
  );

  const getDefinition = useCallback(
    async (word) => {
      try {
        const wordDescriptor = await db.find({
          selector: { word },
          fields: ["definitions"],
        });

        return wordDescriptor.docs[0].definitions[0].defs[0].def;
      } catch (error) {
        console.log(`Error finding descriptor for word ${word}`);
      }
    },
    [db]
  );

  const getDescriptorsForWords = useCallback(
    async (words) => {
      const queries = words.map((word) => {
        return db.find({
          selector: { word },
          fields: ["phonemics", "word"],
        });
      });

      const queriesResults = await Promise.allSettled(queries);

      const inputWordsDescriptors = queriesResults.reduce(
        (acc, queryResult) => {
          return queryResult.status === "fulfilled" &&
            queryResult.value.docs.length > 0
            ? [...acc, queryResult.value.docs[0]]
            : acc;
        },
        []
      );

      return inputWordsDescriptors;
    },
    [db]
  );

  const populate = (db, data) => {
    return db
      .bulkDocs(data)
      .then(function (result) {
        console.log(
          `${result.length} documents were added to ${db.name} database`
        );
        // console.log(result);
      })
      .catch(function (error) {
        console.log(`Error populating database - ${error}`);
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

export { DatabaseProvider, useDatabaseContext };
