import * as React from "react";
import {
  useColorMode,
  useColorModeValue,
  IconButtonProps,
} from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa6";
import { useWeb3ModalTheme } from "@web3modal/wagmi/react";
import { useEffect } from "react";
import { ActionButton } from "../ActionButton";

type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label">;

export function ColorModeSwitcher(props: ColorModeSwitcherProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { setThemeMode } = useWeb3ModalTheme();
  const { text, Icon } = useColorModeValue(
    { text: "dark", Icon: FaMoon },
    { text: "light", Icon: FaSun }
  );

  useEffect(() => {
    setThemeMode(colorMode);
  }, [colorMode, setThemeMode]);

  return (
    <ActionButton
      onClick={toggleColorMode}
      icon={<Icon />}
      aria-label={`Switch to ${text} mode`}
      {...props}
    />
  );
}
