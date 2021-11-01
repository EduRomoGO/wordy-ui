/** @jsx jsx */
import { jsx, css } from "@emotion/react";
// import styled from "@emotion/styled";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import WordsList from "../../WordsList/WordsList";
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

const WordInfo = ({ wordInfo: { word, definition } }) => {
  return (
    <div
      css={css`
        background-color: blue;
        padding: 2rem;
      `}
    >
      {word} - {definition}
    </div>
  );
};

const Words = () => {
  const { parsedDescriptors, getDefinition } = useDatabase();
  const [searchInputWords, setSearchInputWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState();
  const [initialWordNumber, setInitialWordNumber] = useState(0);

  useHotkeys("Command+u", () => {
    handlePlayClick(isFilterActive);
  });
  const isFilterActive = () => searchInputWords.length > 0;

  const getWordInfo = (inputWords, selectedWord) => {
    if (inputWords.length === 1) {
      const word = inputWords[0].word;
      return {
        word,
        definition: getDefinition(word),
      };
    } else if (selectedWord && !isFilterActive()) {
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

  const wordInfo = getWordInfo(searchInputWords, selectedWord);

  const words = parsedDescriptors?.slice(
    parseInt(initialWordNumber, 10),
    parseInt(initialWordNumber, 10) + 20
  );

  const handleSearchInputChange = (inputWords) => {
    setSearchInputWords(inputWords);
  };

  const handleInitialWordNumberChange = (e) =>
    setInitialWordNumber(e.target.value);

  const handleWordClick = (word) => {
    setSelectedWord(word);
  };

  return (
    <section
      css={css`
        padding: 2rem;
      `}
    >
      <SearchWordsForm onChange={handleSearchInputChange} />
      {isFilterActive() && (
        <Phrase
          inputWords={searchInputWords}
          handlePlayClick={(muted) => handlePlayClick(isFilterActive(), muted)}
        />
      )}

      {wordInfo.word && wordInfo.definition && <WordInfo wordInfo={wordInfo} />}

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
          <WordsList onClick={handleWordClick} display="grid" words={words} />
        </div>
      )}
    </section>
  );
};

export { Words };
