import React from "react";
import { useDatabaseLoadStatusContext } from "components/providers/DatabaseLoadStatusProvider";
import { useDatabaseContext } from "components/providers/DatabaseProvider";

export default function useLoadPendingParts() {
  const { loadStatus, pendingParts, updateLoadedParts } =
    useDatabaseLoadStatusContext();
  const currentRenderLoadedPartsRef = React.useRef([]);
  const { db, populate } = useDatabaseContext();

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

    const asyncWrapper = async () => {
      await loadPendingParts(db, pendingParts);

      updateLoadedParts(currentRenderLoadedPartsRef.current);
    };

    if (db) {
      if (loadStatus !== "fullyLoaded") {
        asyncWrapper();
      } else {
        console.info("Database is already populated");
      }
    } else {
      console.error(`db is not available`);
    }

    return () => {
      currentRenderLoadedPartsRef.current = [];
    };
  }, [pendingParts, loadStatus, updateLoadedParts, db, populate]);
}
