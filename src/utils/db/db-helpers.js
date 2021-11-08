// Database helper methods

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

export { checkDb, populate };
