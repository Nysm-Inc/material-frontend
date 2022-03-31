import { Abi } from "starknet";
import { useContract, useStarknetCall } from "@starknet-react/core";
import { craftedMaterialAbi, primitiveMaterialAbi } from "~/abi";
import { CraftedMaterialContractAddress, PrimitiveMaterialContractAddress } from "~/constants";
import { feltToNum, numToFelt } from "~/utils/cairo";
import { craftedMaterialList, primitiveMaterialList } from "~/types";

export const usePrimitiveMaterialSupply = (): { data: number[]; loading: boolean } => {
  const { contract: primitiveMaterialContract } = useContract({
    abi: primitiveMaterialAbi as Abi,
    address: PrimitiveMaterialContractAddress,
  });
  const { data } = useStarknetCall({
    contract: primitiveMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply_batch",
    args: [
      [
        [numToFelt(0), numToFelt(0)],
        [numToFelt(1), numToFelt(0)],
        [numToFelt(2), numToFelt(0)],
        [numToFelt(3), numToFelt(0)],
      ],
    ],
  });
  return {
    // @ts-ignore
    data: data?.res.map((d) => feltToNum(d)) || [...new Array(primitiveMaterialList.length)].fill(0),
    loading: !data,
  };
};

export const useCraftedMaterialSupply = (): { data: number[]; loading: boolean } => {
  const { contract: craftedMaterialContract } = useContract({
    abi: craftedMaterialAbi as Abi,
    address: CraftedMaterialContractAddress,
  });
  const { data } = useStarknetCall({
    contract: craftedMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply_batch",
    args: [
      [
        [numToFelt(0), numToFelt(0)],
        [numToFelt(1), numToFelt(0)],
        [numToFelt(2), numToFelt(0)],
        [numToFelt(3), numToFelt(0)],
        [numToFelt(4), numToFelt(0)],
        [numToFelt(5), numToFelt(0)],
        [numToFelt(6), numToFelt(0)],
        [numToFelt(7), numToFelt(0)],
      ],
    ],
  });
  return {
    // @ts-ignore
    data: data?.res.map((d) => feltToNum(d)) || [...new Array(craftedMaterialList.length)].fill(0),
    loading: !data,
  };
};
