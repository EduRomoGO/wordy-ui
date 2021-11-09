/** @jsx jsx */
import { jsx } from "@emotion/react";
import BounceLoader from "react-spinners/BounceLoader";
import { Frame } from "components/lib";

export const Spinner = () => {
  return (
    <Frame>
      <BounceLoader color="#ff0000" loading={true} speedMultiplier={0.8} />
    </Frame>
  );
};
