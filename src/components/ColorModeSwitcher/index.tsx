import * as React from "react";
import {
  useColorMode,
  useColorModeValue,
  IconButton,
  IconButtonProps,
} from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa6";

type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label">;

export function ColorModeSwitcher(props: ColorModeSwitcherProps) {
  const { toggleColorMode } = useColorMode();
  const { text, Icon } = useColorModeValue(
    { text: "dark", Icon: FaMoon },
    { text: "light", Icon: FaSun }
  );

  return (
    <IconButton
      size="lg"
      fontSize="3xl"
      variant="ghost"
      color="current"
      onClick={toggleColorMode}
      icon={<Icon />}
      aria-label={`Switch to ${text} mode`}
      {...props}
    />
  );
}
