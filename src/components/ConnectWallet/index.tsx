import * as React from "react";
import { Box, IconButton, IconButtonProps, useAccordion } from "@chakra-ui/react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { SiWalletconnect } from "react-icons/si";
import { useAccount } from "wagmi";

type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label">;

export function ConnectWallet(props: ColorModeSwitcherProps) {
  const { open } = useWeb3Modal();
  const { isConnected } = useAccount();
  return (
    <IconButton
      size="lg"
      fontSize="3xl"
      variant="ghost"
      color="current"
      onClick={() => open()}
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
      aria-label={`Connect Web3 wallet`}
      {...props}
    />
  );
}
