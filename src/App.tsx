import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Home } from "@/pages/Home";
import { theme } from "./theme";
import { SpeedInsights } from "@vercel/speed-insights/react";

export const App = () => (
  <ChakraProvider theme={theme}>
    <SpeedInsights />
    <Home />
  </ChakraProvider>
);
