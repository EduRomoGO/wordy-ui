import React from "react";
import { useDatabaseLoadStatusContext } from "components/providers/DatabaseLoadStatusProvider";
import fileNamesJson from "utils/db/divided/file-names";
import { populate, checkDb } from "utils/db/db-helpers";

// first one is already loaded, hence we don't put it here as pending
const [, ...pendingPartsDefault] = fileNamesJson.fileNames.slice(0, 5);

export default function useLoadPendingParts() {
  const { loadStatus, getLoadedParts, updateLoadStatus } =
    useDatabaseLoadStatusContext();

  React.useEffect(() => {
    const writePendingPartWordsToDb = async (part, db) => {
      try {
        const loadFromDiskResult = await import(`utils/db/divided/${part}`);

        await populate(db, loadFromDiskResult.wordDescriptors);

        updateLoadStatus(part);
        console.log(
          `${part} has been successfully populated into databaes ${db.name}`
        );
        return part;
      } catch (error) {
        console.error(`Error loading all the data to database - ${error}`);
        return Promise.reject(part);
      }
    };

    async function loadPendingParts(db, pendingParts = pendingPartsDefault) {
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

    const createOrOpenDb = () => {
      const db = new window.PouchDB("wordsDB");
      console.log(
        `Opened connection to db ${db.name} using adapter ${db.adapter}`
      );

      return db;
    };

    const db = createOrOpenDb();

    const asyncWrapper = async () => {
      let missingParts = pendingPartsDefault.filter(
        (part) => !getLoadedParts().includes(part)
      );

      if (missingParts.length > 0) {
        await loadPendingParts(db, missingParts);
      }
    };

    if (loadStatus !== "fullyLoaded") {
      asyncWrapper();
    }
  }, [getLoadedParts, loadStatus, updateLoadStatus]);
}
