import { Abi } from "starknet";
import { useContract, useStarknetCall } from "@starknet-react/core";
import { craftedMaterialAbi, primitiveMaterialAbi } from "~/abi";
import { CraftedMaterialContractAddress, PrimitiveMaterialContractAddress } from "~/constants";
import { feltToNum, numToFelt } from "~/utils/cairo";

export const usePrimitiveMaterialSupply = (id: number): number => {
  const { contract: primitiveMaterialContract } = useContract({
    abi: primitiveMaterialAbi as Abi,
    address: PrimitiveMaterialContractAddress,
  });
  const { data } = useStarknetCall({
    contract: primitiveMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(id), numToFelt(0)]],
  });
  // @ts-ignore
  return feltToNum(data?.totalSupply?.low);
};

export const useCraftedMaterialSupply = (id: number): number => {
  const { contract: craftedMaterialContract } = useContract({
    abi: craftedMaterialAbi as Abi,
    address: CraftedMaterialContractAddress,
  });
  const { data } = useStarknetCall({
    contract: craftedMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(id), numToFelt(0)]],
  });
  // @ts-ignore
  return feltToNum(data?.totalSupply?.low);
};
