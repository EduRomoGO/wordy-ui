/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Frame } from "components/lib";
import { Button } from "reactstrap";

export const Error = ({ resetHandler, error }) => {
  return (
    <div role="alert">
      <Frame>
        <div>There has been an error</div>
        <pre>{error.message}</pre>
        <Button color="primary" onClick={resetHandler}>
          Try again
        </Button>
      </Frame>
    </div>
  );
};
