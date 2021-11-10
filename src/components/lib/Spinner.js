/** @jsx jsx */
import { jsx } from "@emotion/react";
import BounceLoader from "react-spinners/BounceLoader";
import { Frame } from "components/lib";
import { Spinner as RsSpinner } from "reactstrap";

export const Spinner = ({ size = "full" }) => {
  if (size === "full") {
    return (
      <Frame>
        <BounceLoader color="#ff0000" loading={true} speedMultiplier={0.8} />
      </Frame>
    );
  }

  if (size === "small") {
    return (
      <RsSpinner color="primary" size="sm">
        Loading...
      </RsSpinner>
    );
  }

  throw new Error("Spinner size must be correctly specified");
};
