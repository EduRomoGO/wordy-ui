/** @jsx jsx */
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { Frame } from "components/lib";

export const Error = ({ resetStatus, error }) => {
  return (
    <Frame>
      <div>There has been an error</div>
      <pre>{error.message}</pre>
      <button onClick={resetStatus}>try again</button>
    </Frame>
  );
};
