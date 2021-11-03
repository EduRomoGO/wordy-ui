import { useCallback } from "react";
import { useDatabaseContext } from "../components/providers/DatabaseProvider";

function useDatabase() {
  const { db } = useDatabaseContext();

  const getSomeWords = useCallback(async (db, numberOfWords) => {
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
    }
  }, []);

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

  const getDescriptorsForWords = async (words) => {
    const queries = words.map((word) => {
      return db.find({
        selector: { word },
        fields: ["phonemics", "word"],
      });
    });

    const queriesResults = await Promise.allSettled(queries);

    const inputWordsDescriptors = queriesResults.reduce((acc, queryResult) => {
      return queryResult.status === "fulfilled" &&
        queryResult.value.docs.length > 0
        ? [...acc, queryResult.value.docs[0]]
        : acc;
    }, []);

    return inputWordsDescriptors;
  };

  return {
    getSomeWords: useCallback(
      async (numberOfWords) => {
        const data = await getSomeWords(db, numberOfWords);
        return data;
      },
      [db, getSomeWords]
    ),
    getDefinition,
    getDescriptorsForWords,
    db,
  };
}

export { useDatabase };
