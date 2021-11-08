import React from "react";
import { useDatabaseLoadStatusContext } from "components/providers/DatabaseLoadStatusProvider";
import { populate } from "utils/db/db-helpers";

export default function useLoadPendingParts() {
  const { loadStatus, missingParts, updateLoadedParts } =
    useDatabaseLoadStatusContext();
  const loadedPartsRef = React.useRef([]);

  React.useEffect(() => {
    const writePendingPartWordsToDb = async (part, db) => {
      try {
        const loadFromDiskResult = await import(`utils/db/divided/${part}`);

        await populate(db, loadFromDiskResult.wordDescriptors);

        loadedPartsRef.current.push(part);
        console.log(
          `${part} has been successfully populated into databaes ${db.name}`
        );
        return part;
      } catch (error) {
        console.error(`Error loading all the data to database - ${error}`);
        return Promise.reject(part);
      }
    };

    async function loadPendingParts(db, pendingParts) {
      try {
        const promList = pendingParts.map(async (pendingPart) => {
          return await writePendingPartWordsToDb(pendingPart, db);
        });

        const promListResults = await Promise.allSettled(promList);

        console.log("promListResults");
        console.log(promListResults);

        return promListResults
          .filter((result) => result.status !== "fulfilled")
          .map((result) => result.reason);
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
      await loadPendingParts(db, missingParts);
      const loadedParts = [...loadedPartsRef.current];
      loadedPartsRef.current = [];
      updateLoadedParts(loadedParts);
    };

    if (loadStatus !== "fullyLoaded") {
      asyncWrapper();
    } else {
      console.info("Database is already populated");
    }
  }, [missingParts, loadStatus, updateLoadedParts]);
}
