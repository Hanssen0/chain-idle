import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  fonts: {
    heading: "'serif'",
    body: "'serif'",
  },
  components: {
    Tabs: {
      defaultProps: {
        colorScheme: "alphas",
      },
    },
  },
  shadows: {
    outline: "0 0 0 3px var(--chakra-colors-blackAlpha-100)",
  },
});
