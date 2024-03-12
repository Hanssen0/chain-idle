import * as React from "react";
import { IconButtonProps, Spinner } from "@chakra-ui/react";
import { FaUserPlus } from "react-icons/fa6";
import { useAccount, useWriteContract } from "wagmi";
import { ActionButton } from "../ActionButton";
import { gameAddress } from "@/utils/config";
import { gameAbi } from "@/utils/abis";
import { HugeNum } from "@/utils";

export function ProfileActivator(
  props: Omit<IconButtonProps, "aria-label"> & { blocks: HugeNum }
) {
  const { isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  return (
    <ActionButton
      onClick={() =>
        writeContract({
          address: gameAddress(),
          abi: gameAbi,
          functionName: "initPlayer",
          args: [props.blocks],
        })
      }
      aria-label={`Activate your game profile`}
      isDisabled={!isConnected}
      icon={
        isPending ? <Spinner thickness="0.25rem" size="md" /> : <FaUserPlus />
      }
      {...props}
    ></ActionButton>
  );
}
