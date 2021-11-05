const createOrOpenDb = () => {
  const db = new window.PouchDB("wordsDB");
  console.log(`Opened connection to db ${db.name} using adapter ${db.adapter}`);

  return db;
};

const createOrOpenPartsDb = () => {
  const db = new window.PouchDB("parts");
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
      // console.log(result);
    })
    .catch(function (error) {
      console.log(`Error populating database - ${error}`);
    });
};

const getNextPendingPart = async (partsDb) => {
  const pendingParts = await partsDb.find({
    selector: { loaded: false },
  });

  return pendingParts.docs.length > 0 ? pendingParts.docs[0].name : undefined;
};

const writePendingPartWordsToDb = async (part, db) => {
  try {
    const loadFromDiskResult = await import(`./divided/${part}`);

    // console.log("loadFromDiskResult");
    // console.log(loadFromDiskResult.wordDescriptors);

    await populate(db, loadFromDiskResult.wordDescriptors);

    // await partsDb.put({
    //   _id: `${part}`,
    //   name: `${part}`,
    //   loaded: true,
    // });

    console.log(
      `${part} has been successfully populated into databaes ${db.name}`
    );
    return part;
  } catch (error) {
    console.error(`Error loading all the data to database - ${error}`);
    return Promise.reject(part);
  }
};

const anyPendingPart = async (partsDb) => {
  // const allDocs = await partsDb.allDocs({
  //   include_docs: true,
  // });

  try {
    const pendingParts = await partsDb.find({
      selector: { loaded: false },
    });

    return pendingParts.docs.length > 0;
  } catch (error) {
    console.log(error);
  }
};

const getPendingParts = async (partsDb) => {
  const pendingParts = await partsDb.find({
    selector: { loaded: false },
  });

  return pendingParts.docs.length > 0
    ? pendingParts.docs.map((n) => n.name)
    : [];
};

export async function loadPendingParts(
  pendingParts = ["db-2.json", "db-3.json", "db-fail-4.json"]
) {
  try {
    const db = createOrOpenDb();
    // const partsDb = createOrOpenPartsDb();

    const dbDocsCount = await checkDb(db);

    // if (dbDocsCount < 3800) {
    //   // await populate(partsDb, [
    //   //   { _id: "db-2.json", name: "db-2.json", loaded: false },
    //   //   { _id: "db-3.json", name: "db-3.json", loaded: false },
    //   //   { _id: "db-4.json", name: "db-4.json", loaded: false },
    //   // ]);
    // }

    if (dbDocsCount < 3800) {
      const promList = pendingParts.map(async (pendingPart) => {
        return await writePendingPartWordsToDb(pendingPart, db);
      });

      const promListResults = await Promise.allSettled(promList);

      console.log("promListResults");
      console.log(promListResults);

      return promListResults
        .filter((result) => result.status !== "fulfilled")
        .map((result) => result.reason);
      // return promListResults
    }
    console.log("database is already populated");
    return [];

    // const pendingParts = await getPendingParts(partsDb);
    // console.log("pendingParts");
    // console.log(pendingParts);
  } catch (error) {
    console.error(`Error loading all database - ${error}`);
  }
}

// export async function loadPendingParts() {
//   try {
//     const db = createOrOpenDb();
//     const partsDb = createOrOpenPartsDb();

//     const dbDocsCount = await checkDb(db);

//     if (dbDocsCount < 3800) {
//       populate(partsDb, [
//         { _id: "db-2.json", name: "db-2.json", loaded: false },
//         { _id: "db-3.json", name: "db-3.json", loaded: false },
//         { _id: "db-4.json", name: "db-4.json", loaded: false },
//       ]);
//     }

//     // const partsDbDocsCount = await checkDb(partsDb);
//     // console.log("dbDocsCount");
//     // console.log(dbDocsCount);

//     // mientras que haya alguno
//     // coge el siguiente
//     // escribe datas
//     let isAnyPendingPart;

//     do {
//       isAnyPendingPart = await anyPendingPart(partsDb);
//       if (isAnyPendingPart) {
//         // const nextPendingPart = await getNextPendingPart(partsDb);
//         getNextPendingPart(partsDb)
//           .then((nextPendingPart) => {
//             return writePendingPartWordsToDb(partsDb, nextPendingPart, db);
//           })
//           .then(() => {
//             console.log("write");
//           });

//         // await writePendingPartWordsToDb(partsDb, nextPendingPart, db);
//       }
//     } while (isAnyPendingPart);
//   } catch (error) {
//     console.error(`Error loading all database - ${error}`);
//   }
// }
