import React, { useState, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { DebounceInput } from "react-debounce-input";
import { ReactComponent as CancelIcon } from "../../SVG/cancel.svg";
import { useDatabaseContext } from "components/providers/DatabaseProvider";

function SearchWordsForm({ onChange }) {
  const { getDescriptorsForWords } = useDatabaseContext();

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

  const handleSearchInputChange = async (event) => {
    const input = event.target.value;
    setSearch(input);

    const inputWords = getInputWords(input);

    // Given an array of input words (which may or may not be correct)
    // I want back the descriptors for these words
    const inputWordsDescriptors = await getDescriptorsForWords(inputWords);

    onChange(inputWordsDescriptors);
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

        <div
          className="b-search__cancel"
          tabIndex="0"
          onKeyPress={handleClearClick}
          onClick={handleClearClick}
        >
          <CancelIcon />
        </div>
      </div>
    </article>
  );
}

export default SearchWordsForm;
