import * as React from "react";
import katex from "katex";
import { useEffect, useRef } from "react";
import { Box, BoxProps } from "@chakra-ui/react";

export function Latex(
  props: BoxProps & { children: string; options?: katex.KatexOptions }
) {
  const { children } = props;
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const options: katex.KatexOptions = {
      ...props.options,
      output: props.options?.output ?? "mathml",
    };
    katex.render(children, ref.current, options);
  }, [children, ref, props.options]);

  return (
    <Box
      ref={ref}
      {...{ ...props, children: undefined, options: undefined }}
      className="notranslate"
    />
  );
}
