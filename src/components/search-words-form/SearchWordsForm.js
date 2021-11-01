import React, { useState } from "react";
import { DebounceInput } from "react-debounce-input";
import { ReactComponent as CancelIcon } from "../../SVG/cancel.svg";

function SearchWordsForm({ onChange }) {
  const [search, setSearch] = useState({
    input: "",
  });

  const handleClearClick = () => {
    setSearch({ input: "" });
    onChange("");
  };

  const handleSearchInputChange = (e) => {
    setSearch(e.target.value);
    onChange(e.target.value);
  };

  return (
    <article className="b-search">
      <div className="b-search__wrapper">
        <label htmlFor="search" hidden>
          Search
        </label>
        <DebounceInput
          id="search"
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
