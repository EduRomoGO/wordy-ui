/** @jsx jsx */
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { Frame } from "components/lib";

export const Error = ({ resetStatus }) => {
  return (
    <Frame>
      <div>There has been an error</div>
      <button onClick={resetStatus}>try again</button>
    </Frame>
  );
};
