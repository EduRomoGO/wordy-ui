import fileNamesJson from "utils/db/divided/file-names";

// first one is already loaded, hence we don't put it here as pending
const [, ...pendingPartsDefault] = fileNamesJson.fileNames.slice(0, 5);

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

    await populate(db, loadFromDiskResult.wordDescriptors);

    console.log(
      `${part} has been successfully populated into databaes ${db.name}`
    );
    return part;
  } catch (error) {
    console.error(`Error loading all the data to database - ${error}`);
    return Promise.reject(part);
  }
};

export async function loadPendingParts(db, pendingParts = pendingPartsDefault) {
  try {
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
      console.info("database is already populated");
      return [];
    }
  } catch (error) {
    console.error(`Error loading all database - ${error}`);
  }
}
