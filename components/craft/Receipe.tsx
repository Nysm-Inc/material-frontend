import { FC } from "react";
import { Abi } from "starknet";
import { useContract, useStarknetInvoke } from "@starknet-react/core";
import { Tr } from "~/components/common";
import { craftAbi } from "~/abi";
import { CraftContractAddress } from "~/constants";
import { Receipe, ElapsedStakeTime } from "~/types";

const Receipe: FC<{
  receipe: Receipe;
  dailyMaterials: number[];
  craftMaterials: number[];
  elapsedStakeTime: ElapsedStakeTime;
}> = ({ receipe, dailyMaterials, craftMaterials, elapsedStakeTime, children }) => {
  const { contract: craftContract } = useContract({
    abi: craftAbi as Abi,
    address: CraftContractAddress,
  });

  const { invoke: craft } = useStarknetInvoke({
    contract: craftContract,
    method: receipe.method,
  });

  return (
    <Tr
      h="12"
      {...(receipe.condition(dailyMaterials, craftMaterials, elapsedStakeTime)
        ? {
            cursor: "pointer",
            onClick: () => craft({ args: [] }),
          }
        : {
            cursor: "not-allowed",
            bgColor: "blackAlpha.600",
            color: "whiteAlpha.600",
          })}
    >
      {children}
    </Tr>
  );
};

export default Receipe;
