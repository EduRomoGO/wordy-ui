import React, { useState } from "react";
import WordsList from "../../WordsList/WordsList";
import Hotkeys from "react-hot-keys";
import { useDatabase } from "../../../hooks/useDatabase";
import SearchWordsForm from "../../search-words-form/SearchWordsForm";
import Phrase from "../../phrase/Phrase";

const handlePlayClick = (isFilterActive, muted = false) => {
  const audioElements = [
    ...document.querySelector(".words-short").querySelectorAll("audio"),
  ];

  if (isFilterActive) {
    let timeout = 0;

    audioElements.forEach((audio) => {
      setTimeout(() => {
        if (!muted) {
          audio.play();
        }
      }, timeout * 1000);

      console.log(audio.duration);
      timeout += audio.duration;
    });
  }
};

const WordInfo = ({ def: { word, definition } }) => {
  return word && definition ? (
    <div>
      {word} - {definition}
    </div>
  ) : (
    ""
  );
};

const Words = () => {
  const { getAllDescriptors, getDefinition } = useDatabase();
  const [search, setSearch] = useState({
    inputWords: [],
  });
  const [definition, setDefinition] = useState({
    word: "",
    definition: "",
  });
  const [selectedWord, setSelectedWord] = useState();
  const [initialWordNumber, setInitialWordNumber] = useState(0);

  const allDescriptors = getAllDescriptors();

  const getRefinition = (inputWords, selectedWord) => {
    if (inputWords.length === 1) {
      const word = inputWords[0].word;
      return {
        word,
        definition: getDefinition(word),
      };
    } else if (selectedWord) {
      const word = selectedWord;
      return {
        word,
        definition: getDefinition(word),
      };
    } else {
      return {
        word: "",
        definition: "",
      };
    }
  };

  const refinition = getRefinition(search.inputWords, selectedWord);
  console.log("refinition");
  console.log(refinition);

  const isFilterActive = () => search.inputWords.length > 0;
  const words = allDescriptors?.slice(
    parseInt(initialWordNumber, 10),
    parseInt(initialWordNumber, 10) + 20
  );

  const getInputWords = (search) => {
    const leaveOnlyLetters = (str) => str.replace(/[^A-Za-z\s]/g, "");

    const inputWords = leaveOnlyLetters(search)
      .toLowerCase()
      .split(" ")
      .filter((item) => !!item);

    return inputWords;
  };

  const handleSearchInputChange = (input) => {
    const allWords = allDescriptors.map((item) => item.word);

    const existingInputWords = getInputWords(input).filter((item) =>
      allWords.includes(item)
    );
    const existingInputWordDescriptors = allDescriptors.filter((item) =>
      existingInputWords.includes(item.word)
    );
    const orderedInputWordsDescriptors = existingInputWords.map((input) =>
      existingInputWordDescriptors.find((n) => n.word === input)
    );

    if (existingInputWords.length === 1) {
      setDefinition({
        word: existingInputWords[0],
        definition: getDefinition(existingInputWords[0]),
      });
    } else {
      setDefinition({ word: "", definition: "" });
    }

    setSearch((search) => ({
      ...search,
      inputWords: input.length > 0 ? orderedInputWordsDescriptors : [],
    }));
  };

  const handleInitialWordNumberChange = (e) =>
    setInitialWordNumber(e.target.value);

  const onKeyDown = (keyName) => {
    const keyMap = {
      "Command+j": () => document.querySelector("input").focus(),
      "alt+p": () => handlePlayClick(isFilterActive()),
    };

    keyMap[keyName]();
  };

  const handleWordClick = (word) => {
    setDefinition({ word, definition: getDefinition(word) });
    setSelectedWord(word);
  };

  return (
    <Hotkeys keyName="Command+j,alt+p" onKeyDown={onKeyDown}>
      <SearchWordsForm onChange={handleSearchInputChange} />
      {isFilterActive() && (
        <Phrase
          inputWords={search.inputWords}
          handlePlayClick={(muted) => handlePlayClick(isFilterActive(), muted)}
        />
      )}

      <WordInfo def={definition} />

      {words && !isFilterActive() && (
        <div>
          <section className="starting-word-section">
            <p>Initial word number:</p>
            <input
              onChange={handleInitialWordNumberChange}
              className="starting-word"
              value={initialWordNumber}
            />
          </section>
          <WordsList onClick={handleWordClick} words={words} />
        </div>
      )}
    </Hotkeys>
  );
};

export { Words };
