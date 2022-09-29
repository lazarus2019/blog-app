import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";

// css
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function LoadingCircle() {
  return <ClipLoader color="red" loading={true} css={override} />;
}

export default LoadingCircle;
