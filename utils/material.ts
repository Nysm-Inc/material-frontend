import axios from "axios";
import { hash, number } from "starknet";
import {
  CraftContractAddress,
  CraftedMaterialContractAddress,
  PrimitiveMaterialContractAddress,
  ERC20ContractAddress,
  starknetFeederGateway,
} from "~/constants";
import { feltToNum, numToFelt } from "./cairo";

export const fetchPrimitiveMaterials = async (account: string): Promise<number[]> => {
  const len = 4;
  const owners = [...new Array(len)].map(() => numToFelt(account));
  const tokenIDs = [...new Array(len)].reduce((memo, _, i) => [...memo, numToFelt(i), numToFelt(0)], []);
  const res = await axios.post<{ result: string[] }>(starknetFeederGateway, {
    signature: [],
    calldata: [numToFelt(len), ...owners, numToFelt(len), ...tokenIDs],
    contract_address: PrimitiveMaterialContractAddress,
    entry_point_selector: number.toHex(hash.starknetKeccak("balance_of_batch")),
  });
  const materials = res.data.result.map((res) => feltToNum(res));
  materials.shift();
  return materials;
};

export const fetchCraftedMaterials = async (account: string): Promise<number[]> => {
  const len = 8;
  const owners = [...new Array(len)].map(() => numToFelt(account));
  const tokenIDs = [...new Array(len)].reduce((memo, _, i) => [...memo, numToFelt(i), numToFelt(0)], []);
  const res = await axios.post<{ result: string[] }>(starknetFeederGateway, {
    signature: [],
    calldata: [numToFelt(len), ...owners, numToFelt(len), ...tokenIDs],
    contract_address: CraftedMaterialContractAddress,
    entry_point_selector: number.toHex(hash.starknetKeccak("balance_of_batch")),
  });
  const materials = res.data.result.map((res) => feltToNum(res));
  materials.shift();
  return materials;
};

export const fetchElapsedForgeTime = async (account: string, method: string): Promise<number> => {
  const res = await axios.post<{ result: string[] }>(starknetFeederGateway, {
    signature: [],
    calldata: [numToFelt(account)],
    contract_address: CraftContractAddress,
    entry_point_selector: number.toHex(hash.starknetKeccak(method)),
  });
  return feltToNum(res.data.result);
};

export const fetchBalanceOfErc20 = async (account: string): Promise<number> => {
  const res = await axios.post<{ result: string[] }>(starknetFeederGateway, {
    signature: [],
    calldata: [numToFelt(account)],
    contract_address: ERC20ContractAddress,
    entry_point_selector: number.toHex(hash.starknetKeccak("balanceOf")),
  });
  return feltToNum(res.data.result[0]);
};
