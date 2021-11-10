/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Frame } from "components/lib";
import { Button } from "reactstrap";

export const Error = ({ resetStatus, error }) => {
  return (
    <Frame>
      <div>There has been an error</div>
      <pre>{error.message}</pre>
      <Button color="primary" onClick={resetStatus}>
        try again
      </Button>
    </Frame>
  );
};
