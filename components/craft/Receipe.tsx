import { FC } from "react";
import { Abi } from "starknet";
import { useContract, useStarknetInvoke } from "@starknet-react/core";
import { Tr } from "~/components/common";
import { craftAbi } from "~/abi";
import { CraftContractAddress } from "~/constants";
import { Receipe } from "~/types";

const Receipe: FC<{ receipe: Receipe; dailyMaterials: number[]; craftMaterials: number[] }> = ({
  receipe,
  dailyMaterials,
  craftMaterials,
  children,
}) => {
  const { contract: craftContract } = useContract({
    abi: craftAbi as Abi,
    address: CraftContractAddress,
  });

  // todo: disabled after invoke
  const { invoke: craft } = useStarknetInvoke({
    contract: craftContract,
    method: receipe.method,
  });
  return (
    <Tr
      h="12"
      {...(receipe.condition(dailyMaterials, craftMaterials)
        ? {
            cursor: "pointer",
            onClick: () => craft({ args: [] }),
          }
        : {
            cursor: "not-allowed",
            bgColor: "black",
            opacity: 0.6,
          })}
    >
      {children}
    </Tr>
  );
};

export default Receipe;
