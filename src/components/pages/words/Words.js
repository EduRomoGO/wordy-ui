/** @jsx jsx */
import { jsx, css } from "@emotion/react";
// import styled from "@emotion/styled";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import WordsList from "../../WordsList/WordsList";
import { useDatabase } from "../../../hooks/useDatabase";
import SearchWordsForm from "../../search-words-form/SearchWordsForm";
import Phrase from "../../phrase/Phrase";

let timeoutList = [];

const handlePlayClick = ({ isFilterActive, muted = false, wordsRef }) => {
  if (isFilterActive) {
    const audioElements = [...wordsRef.current.querySelectorAll("audio")];

    const wordsSeparation = 50;
    let timeout = 0;

    audioElements.forEach((audio) => {
      timeoutList.push(
        setTimeout(() => {
          if (!muted) {
            audio.play();
          }
        }, timeout * 1000 + wordsSeparation)
      );

      timeout += audio.duration;
    });
  }
};

const handleStopClick = () => {
  timeoutList.forEach(clearTimeout);
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
    handlePlayClick({ isFilterActive: isFilterActive() });
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
          handlePlayClick={(wordsRef) =>
            handlePlayClick({
              isFilterActive: isFilterActive(),
              wordsRef,
            })
          }
          handleStopClick={handleStopClick}
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
