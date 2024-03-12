import * as React from "react";
import {
  IconButton as ChakraIconButton,
  IconButtonProps,
} from "@chakra-ui/react";

export function ActionButton(props: IconButtonProps) {
  return (
    <ChakraIconButton
      size="lg"
      fontSize="3xl"
      variant="ghost"
      color="current"
      {...props}
    />
  );
}
