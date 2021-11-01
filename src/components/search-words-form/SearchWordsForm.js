import React, { useState, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { DebounceInput } from "react-debounce-input";
import { ReactComponent as CancelIcon } from "../../SVG/cancel.svg";
import { useDatabase } from "../../hooks/useDatabase";

function SearchWordsForm({ onChange }) {
  const { parsedDescriptors } = useDatabase();

  const [search, setSearch] = useState({
    input: "",
  });
  const searchInputRef = useRef();

  useHotkeys("Command+j", () => {
    searchInputRef.current.focus();
  });

  const handleClearClick = () => {
    setSearch({ input: "" });
    onChange("");
  };

  const getInputWords = (search) => {
    const leaveOnlyLetters = (str) => str.replace(/[^A-Za-z\s]/g, "");

    const inputWords = leaveOnlyLetters(search)
      .toLowerCase()
      .split(" ")
      .filter((item) => !!item);

    return inputWords;
  };

  const handleSearchInputChange = (event) => {
    const input = event.target.value;
    setSearch(input);

    const allWords = parsedDescriptors?.map((item) => item.word);

    const existingInputWords = getInputWords(input).filter((item) =>
      allWords.includes(item)
    );
    const existingInputWordDescriptors = parsedDescriptors?.filter((item) =>
      existingInputWords.includes(item.word)
    );
    const orderedInputWordsDescriptors = existingInputWords.map((input) =>
      existingInputWordDescriptors.find((n) => n.word === input)
    );

    onChange(input.length > 0 ? orderedInputWordsDescriptors : []);
  };

  return (
    <article className="b-search">
      <div className="b-search__wrapper">
        <label htmlFor="search" hidden>
          Search
        </label>
        <DebounceInput
          id="search"
          inputRef={searchInputRef}
          debounceTimeout={600}
          className="b-search__input"
          value={search.input}
          onChange={handleSearchInputChange}
          placeholder="Command+j to focus"
        />
        <CancelIcon
          className="b-search__cancel"
          tabIndex="0"
          onKeyPress={handleClearClick}
          onClick={handleClearClick}
        />
      </div>
    </article>
  );
}

export default SearchWordsForm;
