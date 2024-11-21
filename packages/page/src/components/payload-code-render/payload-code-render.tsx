import React from "react";
import { CodeRender } from "../code-render/code-render.js";

export const PayloadCodeRender: React.FC<{ payload: any }> = ({ payload }) => {
  return (
    <>
      <CodeRender payload={payload} displayTypes={["ts"]}></CodeRender>
    </>
  );
};
