// import { useState, useEffect } from "react";
import { useDatabaseContext } from "../components/providers/DatabaseProvider";

const getDefinitionImpl = (db, word) => {
  const wordDescriptor = db?.wordDescriptors.find((item) => item.word === word);

  return wordDescriptor ? wordDescriptor.definitions[0].defs[0].def : "";
};

function useDatabase() {
  const { db, parsedDescriptors } = useDatabaseContext();

  return {
    parsedDescriptors,
    getDefinition: (word) => getDefinitionImpl(db, word),
  };
}

export { useDatabase };
