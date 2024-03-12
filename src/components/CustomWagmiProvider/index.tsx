import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { arbitrumSepolia } from "wagmi/chains";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { WagmiProvider } from "wagmi";
import { ReactNode } from "react";
import {
  appDescription,
  appIcons,
  appName,
  appURL,
  walletConnectProjectId,
} from "@/utils/config";

const queryClient = new QueryClient();
const projectId = walletConnectProjectId();
const metadata = {
  name: appName(),
  description: appDescription(),
  url: appURL(),
  icons: appIcons(),
};

const chains = [arbitrumSepolia] as const;
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

createWeb3Modal({
  wagmiConfig,
  projectId,
});

export function CustomWagmiProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
