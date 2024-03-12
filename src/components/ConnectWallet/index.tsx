import * as React from "react";
import { Box, IconButtonProps } from "@chakra-ui/react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { SiWalletconnect } from "react-icons/si";
import { useAccount } from "wagmi";
import { ActionButton } from "../ActionButton";

export function ConnectWallet(props: Omit<IconButtonProps, "aria-label">) {
  const { open } = useWeb3Modal();
  const { isConnected } = useAccount();

  return (
    <ActionButton
      onClick={() => open()}
      aria-label={`Connect Web3 wallet`}
      icon={
        <>
          <SiWalletconnect />
          <Box
            width="0.4rem"
            height="0.4rem"
            borderRadius="50%"
            background="#49D49D"
            position="absolute"
            bottom="0.3rem"
            left="50%"
            transform="translateX(-50%)"
            opacity={isConnected ? "1" : "0"}
          />
        </>
      }
      {...props}
    ></ActionButton>
  );
}
