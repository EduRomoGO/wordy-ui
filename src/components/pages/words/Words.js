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

  // let userIDs = [1,2,3];

  // audioElements.reduce( async (previousPromise, next) => {
  //   await previousPromise;

  //   return next.play();
  // }, Promise.resolve());

  // audioElements[0].play().then(() => console.log('cool'));
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

const Words = () => {
  const { getAllDescriptors, getDefinition } = useDatabase();
  const [search, setSearch] = useState({
    input: "",
    inputWords: [],
  });
  const [definition, setDefinition] = useState({
    word: "",
    definition: "",
  });
  const [initialWordNumber, setInitialWordNumber] = useState(0);

  const isFilterActive = () => search.inputWords.length > 0;
  const words = getAllDescriptors()?.slice(
    parseInt(initialWordNumber, 10),
    parseInt(initialWordNumber, 10) + 20
  );

  // const playAudio = ({audio, timeout}) => new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     audio.play();
  //   }, timeout * 1000);
  // });

  const getInputWords = (search) => {
    const leaveOnlyLetters = (str) => str.replace(/[^A-Za-z\s]/g, "");

    const inputWords = leaveOnlyLetters(search)
      .toLowerCase()
      .split(" ")
      .filter((item) => !!item);

    return inputWords;
  };

  const handleSearchInputChange = (input) => {
    const allDescriptors = getAllDescriptors();
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
      input,
    }));
  };

  const handleInitialWordNumberChange = (e) =>
    setInitialWordNumber(e.target.value);

  const onKeyDown = (keyName) => {
    const keyMap = {
      // j cause it is free
      "Command+j": () => document.querySelector("input").focus(),
      "alt+p": () => handlePlayClick(isFilterActive()),
    };

    keyMap[keyName]();
  };

  const handleWordClick = (word) => {
    setDefinition({ word, definition: getDefinition(word) });
  };

  const renderDefinition = ({ word, definition }) => {
    return word && definition ? (
      <div>
        {word} - {definition}
      </div>
    ) : (
      ""
    );
  };

  return (
    <Hotkeys keyName="Command+j,alt+p" onKeyDown={onKeyDown}>
      <SearchWordsForm onChange={handleSearchInputChange} />
      <Phrase
        isFilterActive={isFilterActive()}
        inputWords={search.inputWords}
        handlePlayClick={handlePlayClick}
      />

      {renderDefinition(definition)}
      <section className="starting-word-section">
        <p>Initial word number:</p>
        <input
          onChange={handleInitialWordNumberChange}
          className="starting-word"
          value={initialWordNumber}
        />
      </section>
      {words && (
        <WordsList
          onClick={handleWordClick}
          words={words}
          hidden={isFilterActive()}
        />
      )}
    </Hotkeys>
  );
};

export { Words };
