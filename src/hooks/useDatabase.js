import { useCallback } from "react";
import { useDatabaseContext } from "../components/providers/DatabaseProvider";

const getDefinitionImpl = (db, word) => {
  // const wordDescriptor = db?.wordDescriptors.find((item) => item.word === word);

  // return wordDescriptor ? wordDescriptor.definitions[0].defs[0].def : "";
  return "fake definition";
};

// TODO: Refactor to simplify function calls
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

  return {
    getSomeWords: useCallback(
      async (numberOfWords) => {
        const data = await getSomeWords(db, numberOfWords);
        return data;
      },
      [db, getSomeWords]
    ),
    getDefinition: (word) => getDefinitionImpl(db, word),
    db,
  };
}

export { useDatabase };
