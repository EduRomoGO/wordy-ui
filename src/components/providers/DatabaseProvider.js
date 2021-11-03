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

  const createOrOpenDb = () => {
    // eslint-disable-next-line no-undef
    const db = new PouchDB("wordsDB");
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

  // eslint-disable-next-line no-unused-vars
  const testDb = async (db) => {
    // db.get("1a687eb1-6bdb-43b2-b181-2ac8036ec39a")
    //   .then((result) => {
    //     console.log(`found result ${result}`);
    //     console.log(result);
    //   })
    //   .catch(console.log);

    await db.createIndex({
      index: { fields: ["word"] },
    });

    db.find({
      selector: { word: "school" },
      fields: ["_id", "word"],
      sort: ["word"],
    })
      .then(function (result) {
        console.log(`found result`);
        console.log(result.docs);
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const db = createOrOpenDb();

        const dbDocsCount = await checkDb(db);

        // testDb(db);

        if (dbDocsCount > 0) {
          setDb(db);
        } else {
          const data = await import(
            // TODO: Cambiar a db.json cuando termine de probar en dev
            /* webpackPrefetch: true */ "../../utils/db/db-test.json"
          );

          await populate(db, data);

          setDb(db);
        }

        // Ahora estoy devolviendo la db en lugar de los documentos, por eso
        // hay que cambiar la manera en la que se usa todo
      } catch (error) {
        throw new Error(`Error loading database ${error}`);
      }
    };

    loadDatabase();

    return () => {
      const db = createOrOpenDb();

      db.close();
    };
  }, []);

  return (
    <DatabaseContext.Provider value={{ db }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export { DatabaseProvider, useDatabaseContext };
