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
      // console.log(result);
    })
    .catch(function (error) {
      console.log(`Error populating database - ${error}`);
    });
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

export async function loadPendingParts(
  pendingParts = ["db-2.json", "db-3.json", "db-fail-4.json"]
) {
  try {
    const db = createOrOpenDb();

    const dbDocsCount = await checkDb(db);

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
    } else {
      console.log("database is already populated");
      return [];
    }
  } catch (error) {
    console.error(`Error loading all database - ${error}`);
  }
}
