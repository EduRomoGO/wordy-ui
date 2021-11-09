/** @jsx jsx */
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import BounceLoader from "react-spinners/BounceLoader";
import React, { useEffect, useState } from "react";
import Word from "../Word/Word.js";
import cuid from "cuid";
import "./Spell.css";
import { useDatabaseLoadStatusContext } from "components/providers/DatabaseLoadStatusProvider";
import { useDatabaseContext } from "components/providers/DatabaseProvider";

const Spell = () => {
  const { getDescriptorsForWords } = useDatabaseContext();
  const [letterDescriptors, setLetterDescriptors] = useState([]);
  const [status, setStatus] = useState("idle");
  const { loadStatus } = useDatabaseLoadStatusContext();

  const letters = React.useMemo(
    () => [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ],
    []
  );

  useEffect(() => {
    const loadLetterDescriptors = async () => {
      try {
        setStatus("loading");

        const letterDescriptors = await getDescriptorsForWords(letters);
        setStatus("resolved");
        setLetterDescriptors(letterDescriptors);
      } catch (error) {
        console.error(`Error loading letter descriptors - ${error}`);
        setStatus("rejected");
      }
    };

    loadLetterDescriptors();
  }, [getDescriptorsForWords, letters]);

  const Frame = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `;

  if (status === "idle" || status === "loading" || loadStatus === "empty") {
    return (
      <Frame>
        <BounceLoader color="#ff0000" loading={true} speedMultiplier={0.8} />
      </Frame>
    );
  }

  if (status === "rejected") {
    return <div>An error has happened</div>;
  }

  if (status === "resolved") {
    return (
      <div className="spell-component-wrapper">
        {letterDescriptors.map(({ word, phonemics }) => (
          <Word type="spell" key={cuid()} word={word} phonemics={phonemics} />
        ))}
      </div>
    );
  }
};

export default Spell;
