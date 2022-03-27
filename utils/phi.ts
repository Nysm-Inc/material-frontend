import axios from "axios";
import { hash, number } from "starknet";
import { starknetFeederGateway, WrapCraftMaterialContractAddress, WrapMaterialContractAddress } from "~/constants";
import { feltToNum, numToFelt } from "~/utils/cairo";

export const fetchWrapMaterials = async (account: string): Promise<number[]> => {
  const len = 4;
  const owners = [...new Array(len)].map(() => numToFelt(account));
  const tokenIDs = [...new Array(len)].reduce((memo, _, i) => [...memo, numToFelt(i), numToFelt(0)], []);
  const res = await axios.post<{ result: string[] }>(starknetFeederGateway, {
    signature: [],
    calldata: [numToFelt(len), ...owners, numToFelt(len), ...tokenIDs],
    contract_address: WrapMaterialContractAddress,
    entry_point_selector: number.toHex(hash.starknetKeccak("balance_of_batch")),
  });
  const materials = res.data.result.map((res) => feltToNum(res));
  materials.shift();
  return materials;
};

export const fetchWrapCraftMaterials = async (account: string): Promise<number[]> => {
  const len = 8;
  const owners = [...new Array(len)].map(() => numToFelt(account));
  const tokenIDs = [...new Array(len)].reduce((memo, _, i) => [...memo, numToFelt(i), numToFelt(0)], []);
  const res = await axios.post<{ result: string[] }>(starknetFeederGateway, {
    signature: [],
    calldata: [numToFelt(len), ...owners, numToFelt(len), ...tokenIDs],
    contract_address: WrapCraftMaterialContractAddress,
    entry_point_selector: number.toHex(hash.starknetKeccak("balance_of_batch")),
  });
  const materials = res.data.result.map((res) => feltToNum(res));
  materials.shift();
  return materials;
};
