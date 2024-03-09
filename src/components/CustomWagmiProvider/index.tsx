import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { arbitrumSepolia } from "wagmi/chains";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { WagmiProvider } from "wagmi";
import { ReactNode } from "react";

const queryClient = new QueryClient();
const projectId = "b6f6753d232556c819d9508e540f471e";
const metadata = {
  name: "Chain Idle",
  description: "An on-chain game about the chain",
  url: "https://chain-idle.vercel.app/",
  icons: [],
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
