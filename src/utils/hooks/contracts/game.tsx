import { gameAbi } from "@/utils/abis";
import { gameAddress } from "@/utils/config";
import { useAccount, useReadContract } from "wagmi";

export function usePlayer() {
  const { address } = useAccount();

  return useReadContract({
    address: address ? gameAddress() : undefined,
    abi: gameAbi,
    functionName: "getPlayer",
    args: [address ?? "0x"],
    query: {
      refetchInterval: 1000,
    },
  });
}
