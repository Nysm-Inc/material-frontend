import { FC } from "react";
import { Abi } from "starknet";
import { useContract, useStarknetInvoke } from "@starknet-react/core";
import { Tr } from "~/components/common";
import { craftAbi } from "~/abi";
import { CraftContractAddress } from "~/constants";
import { Recipe, ElapsedForgeTime } from "~/types";

const Recipe: FC<{
  recipe: Recipe;
  dailyMaterials: number[];
  craftMaterials: number[];
  elapsedForgeTime: ElapsedForgeTime;
}> = ({ recipe, dailyMaterials, craftMaterials, elapsedForgeTime, children }) => {
  const { contract: craftContract } = useContract({
    abi: craftAbi as Abi,
    address: CraftContractAddress,
  });

  const { invoke: craft } = useStarknetInvoke({
    contract: craftContract,
    method: recipe.method,
  });

  return (
    <Tr
      h="12"
      {...(recipe.condition(dailyMaterials, craftMaterials, elapsedForgeTime)
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

export default Recipe;
