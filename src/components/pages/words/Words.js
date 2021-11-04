/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useState, useEffect, useCallback } from "react";
import WordsList from "../../WordsList/WordsList";
import { useDatabase } from "hooks/useDatabase";
import SearchWordsForm from "../../search-words-form/SearchWordsForm";
import Phrase from "../../phrase/Phrase";

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
  const { getSomeWords, getDefinition } = useDatabase();
  const [searchInputWords, setSearchInputWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState();
  const [initialWordNumber, setInitialWordNumber] = useState(0);
  const [words, setWords] = useState([]);
  const [wordInfo, setWordInfo] = useState({
    word: "",
    definition: "",
  });

  const isSearchActive = useCallback(
    () => searchInputWords.length > 0,
    [searchInputWords.length]
  );

  useEffect(() => {
    const getWordInfo = async (inputWords, selectedWord) => {
      if (inputWords.length === 1) {
        const word = inputWords[0].word;

        setWordInfo({
          word,
          definition: await getDefinition(word),
        });
      } else if (selectedWord && !isSearchActive()) {
        const word = selectedWord;
        setWordInfo({
          word,
          definition: await getDefinition(word),
        });
      } else {
        setWordInfo({
          word: "",
          definition: "",
        });
      }
    };

    getWordInfo(searchInputWords, selectedWord);
  }, [getDefinition, isSearchActive, searchInputWords, selectedWord]);

  useEffect(() => {
    const loadWords = async () => {
      const words = await getSomeWords(20);
      setWords(words);
    };

    loadWords();
  }, [getSomeWords]);

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
      {isSearchActive() && searchInputWords.length > 0 && (
        <Phrase inputWords={searchInputWords} />
      )}

      {wordInfo.word && wordInfo.definition && <WordInfo wordInfo={wordInfo} />}

      {words.length > 0 && !isSearchActive() && (
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
