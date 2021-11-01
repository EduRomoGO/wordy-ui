// import db from "../utils/db/db.json";
import { useState, useEffect } from "react";

const getAllDescriptorsImpl = (db) => {
  return db?.wordDescriptors.map((item) => ({
    word: item.word,
    phonemics: item.phonemics,
  }));
  // .map(item => ({ word: item.word, phonemics: item.phonemics }))
  // .slice(0, 40);
};

const getDefinitionImpl = (db, word) => {
  const allDescriptors = db?.wordDescriptors;
  const wordDescriptor = allDescriptors.find((item) => item.word === word);

  return wordDescriptor ? wordDescriptor.definitions[0].defs[0].def : "";
};

function useDatabase() {
  const [db, setDb] = useState();

  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const data = await import("../utils/db/db.json");
        setDb(data);
      } catch (error) {
        throw new Error(`Error loading database ${error}`);
      }
    };

    loadDatabase();
  }, []);

  return {
    getAllDescriptors: () => getAllDescriptorsImpl(db),
    getDefinition: (word) => getDefinitionImpl(db, word),
  };
}

export { useDatabase };
