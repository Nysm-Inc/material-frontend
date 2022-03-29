import { FC } from "react";
import { Abi } from "starknet";
import { useContract, useStarknetInvoke } from "@starknet-react/core";
import { Tr } from "~/components/common";
import { craftAbi } from "~/abi";
import { CraftContractAddress } from "~/constants";
import { Recipe, ElapsedForgeTime } from "~/types";

const Recipe: FC<{
  recipe: Recipe;
  primitiveMaterials: number[];
  craftedMaterials: number[];
  elapsedForgeTime: ElapsedForgeTime;
}> = ({ recipe, primitiveMaterials, craftedMaterials, elapsedForgeTime, children }) => {
  const { contract: craftContract } = useContract({
    abi: craftAbi as Abi,
    address: CraftContractAddress,
  });
  const { invoke: crafted } = useStarknetInvoke({
    contract: craftContract,
    method: recipe.method,
  });

  return (
    <Tr
      h="12"
      {...(recipe.condition(primitiveMaterials, craftedMaterials, elapsedForgeTime)
        ? {
            cursor: "pointer",
            onClick: () => crafted({ args: [] }),
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
