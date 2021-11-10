/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useState, useEffect, useCallback } from "react";
import WordsList from "../../WordsList/WordsList";
import { useDatabaseContext } from "components/providers/DatabaseProvider";
import SearchWordsForm from "../../search-words-form/SearchWordsForm";
import Phrase from "../../phrase/Phrase";
import { Spinner, Error } from "components/lib";
import { useAsync } from "hooks/useAsync";

const WordInfo = ({ searchInputWords, selectedWord, isSearchActive }) => {
  const { getDefinition } = useDatabaseContext();
  const [wordInfo, setWordInfo] = useState({
    word: "",
    definition: "",
  });

  const { word, definition } = wordInfo;

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

  if (word && definition) {
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
  }

  return null;
};

const Words = () => {
  const { getSomeWords } = useDatabaseContext();
  const [searchInputWords, setSearchInputWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState();
  const [initialWordNumber, setInitialWordNumber] = useState(0);
  const {
    run,
    data: words,
    status,
    error,
    resetStatus: resetWordsStatus,
  } = useAsync();

  const isSearchActive = useCallback(() => searchInputWords.length > 0, [
    searchInputWords.length,
  ]);

  const resetStatus = () => {
    setSearchInputWords([]);
    setSelectedWord();
    setInitialWordNumber(0);
    resetWordsStatus();
  };

  useEffect(() => {
    // throw new Error("💥 CABOOM 💥");

    if (status === "idle") {
      run(getSomeWords(20));
    }
  }, [getSomeWords, run, status]);

  const handleSearchInputChange = (inputWords) => {
    setSearchInputWords(inputWords);
  };

  const handleInitialWordNumberChange = (e) =>
    setInitialWordNumber(e.target.value);

  const handleWordClick = (word) => {
    setSelectedWord(word);
  };

  if (status === "pending" || status === "idle") {
    return <Spinner />;
  }

  if (status === "rejected") {
    return <Error resetHandler={resetStatus} error={error} />;
  }

  if (status === "resolved") {
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

        <WordInfo
          searchInputWords={searchInputWords}
          selectedWord={selectedWord}
          isSearchActive={isSearchActive}
        />

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
  }
};

export { Words };
