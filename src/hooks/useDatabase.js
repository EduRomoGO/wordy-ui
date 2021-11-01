// import { useState, useEffect } from "react";
import { useDatabaseContext } from "../components/providers/DatabaseProvider";

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
  const db = useDatabaseContext();
  // const [db, setDb] = useState();

  return {
    getAllDescriptors: () => getAllDescriptorsImpl(db),
    getDefinition: (word) => getDefinitionImpl(db, word),
  };
}

export { useDatabase };
