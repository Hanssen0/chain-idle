import { ChakraProvider } from "@chakra-ui/react";
import { Home } from "@/pages/Home";
import { theme } from "./theme";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import {
  NotificationProvider,
  useSendNotification,
} from "./components/Notifications";
import { useEffect } from "react";
import { ServiceWorkerStatus, onceSW } from "./utils/serviceWorker";
import { LibraryProvider } from "./components/Library";
import { PopupProvider } from "./components/Popup";
import { GameProvider } from "./components/Game";
import { CustomWagmiProvider } from "./components/CustomWagmiProvider";

function InnerApp() {
  const send = useSendNotification();

  useEffect(() => {
    onceSW(ServiceWorkerStatus.Initialized, () =>
      send({ content: "Cached for faster loading", timeout: 2500 })
    );
    onceSW(ServiceWorkerStatus.Pending, () =>
      send({ content: "An update. Close all tabs for this page to finish it" })
    );
    onceSW(ServiceWorkerStatus.Updated, () =>
      send({ content: "Update finished", timeout: 3000 })
    );
  }, [send]);

  return (
    <>
      <Home />
    </>
  );
}

export function App() {
  return (
    <ChakraProvider theme={theme}>
      <Analytics />
      <SpeedInsights />
      <CustomWagmiProvider>
        <GameProvider>
          <NotificationProvider>
            <PopupProvider>
              <LibraryProvider>
                <InnerApp />
              </LibraryProvider>
            </PopupProvider>
          </NotificationProvider>
        </GameProvider>
      </CustomWagmiProvider>
    </ChakraProvider>
  );
}
