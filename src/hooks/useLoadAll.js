import React from "react";
import { useDatabaseLoadStatusContext } from "components/providers/DatabaseLoadStatusProvider";
import { populate } from "utils/db/db-helpers";

export default function useLoadPendingParts() {
  const { loadStatus, missingParts, updateLoadedParts } =
    useDatabaseLoadStatusContext();
  const currentRenderLoadedPartsRef = React.useRef([]);

  React.useEffect(() => {
    const writePendingPartWordsToDb = async (part, db) => {
      try {
        const loadFromDiskResult = await import(`utils/db/divided/${part}`);

        await populate(db, loadFromDiskResult.wordDescriptors);

        currentRenderLoadedPartsRef.current.push(part);
        console.log(
          `${part} has been successfully populated into databaes ${db.name}`
        );
        return part;
      } catch (error) {
        console.error(`Error loading database pending parts - ${error}`);
        return Promise.reject(part);
      }
    };

    async function loadPendingParts(db, pendingParts) {
      const promiseList = pendingParts.map(async (pendingPart) => {
        return await writePendingPartWordsToDb(pendingPart, db);
      });

      return await Promise.allSettled(promiseList);
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
      updateLoadedParts(currentRenderLoadedPartsRef.current);
    };

    if (loadStatus !== "fullyLoaded") {
      asyncWrapper();
    } else {
      console.info("Database is already populated");
    }

    return () => {
      currentRenderLoadedPartsRef.current = [];
    };
  }, [missingParts, loadStatus, updateLoadedParts]);
}
