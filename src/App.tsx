import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Home } from "@/pages/Home";
import { theme } from "./theme";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Analytics />
    <SpeedInsights />
    <Home />
  </ChakraProvider>
);
