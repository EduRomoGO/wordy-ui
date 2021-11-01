/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import Word from "../Word/Word.js";
import cuid from "cuid";
import { forwardRef } from "react";

const getStyle = (display) => {
  const inline = css`
    display: block;
    padding: 30px;
    line-height: 65px;
  `;
  const grid = css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    grid-gap: 1.5rem;
    align-items: center;
    max-width: 960px;
    margin: 0 auto;
  `;

  const displayOptions = {
    grid,
    inline,
  };

  return displayOptions[display];
};

const WordsList = ({ words, display, onClick }, wordsRef) => {
  const getKey = () => cuid();

  return (
    <div css={getStyle(display)} ref={wordsRef}>
      {words.map(({ word, phonemics }, id) => (
        <Word
          onClick={onClick}
          short={display === "inline"}
          key={getKey(id)}
          word={word}
          phonemics={phonemics}
        />
      ))}
    </div>
  );
};

export default forwardRef(WordsList);
