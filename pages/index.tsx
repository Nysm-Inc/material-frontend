import axios from "axios";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { Abi, hash, number } from "starknet";
import { useStarknet, useContract, useStarknetCall, useStarknetInvoke } from "@starknet-react/core";
import { Box, Button, Center, Divider, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { craftAbi, dailyBonusAbi, dailyMaterialAbi } from "~/abi";
import WalletStarknet from "~/components/wallet/Starknet";
import { CraftContractAddress, DailyBonusContractAddress, DailyMaterialContractAddress } from "~/constants";
import { stringToBN, toBN, toNumber } from "~/utils/cairo";

const Index: NextPage = () => {
  const { account } = useStarknet();

  // -------- Daily Bonus --------
  const { contract: dailyBonusContract } = useContract({
    abi: dailyBonusAbi as Abi,
    address: DailyBonusContractAddress,
  });

  const { data: elapsedLoginTime } = useStarknetCall({
    contract: dailyBonusContract,
    method: "check_elapsed_time",
    args: [toBN(account)],
  });
  // note: must invoke register_owner before get_reward
  const { invoke: getReward } = useStarknetInvoke({
    contract: dailyBonusContract,
    method: "get_reward",
  });

  // -------- Daily Material --------
  const { contract: dailyMaterialContract } = useContract({
    abi: dailyMaterialAbi as Abi,
    address: DailyMaterialContractAddress,
  });
  const [myMaterials, setMyMaterials] = useState<number[]>([]);
  const fetchMyMaterials = useCallback(async () => {
    const endpoint = "https://alpha4.starknet.io/feeder_gateway/call_contract?blockId=null";
    const len = 4;
    const owners = [...new Array(len)].map(() => toBN(account));
    const tokenIDs = [...new Array(len)].reduce((memo, _, i) => [...memo, toBN(i), toBN(0)], []);
    const res = await axios.post<{ result: string[] }>(endpoint, {
      signature: [],
      calldata: [toBN(len), ...owners, toBN(len), ...tokenIDs],
      contract_address: DailyMaterialContractAddress,
      entry_point_selector: number.toHex(hash.starknetKeccak("balance_of_batch")),
    });
    const materials = res.data.result.map((res) => toNumber(res));
    materials.shift();
    return materials;
  }, [account]);

  useEffect(() => {
    if (!account) return;

    (async () => {
      const materials = await fetchMyMaterials();
      setMyMaterials(materials);
    })();
  }, [account, fetchMyMaterials]);

  // -------- Craft --------
  const { contract: craftContract } = useContract({
    abi: craftAbi as Abi,
    address: CraftContractAddress,
  });
  const { invoke: craftSoil2Brick } = useStarknetInvoke({
    contract: craftContract,
    method: "craft_soil_2_brick",
  });

  // -------- Craft Material --------

  return (
    <VStack w="100vw" h="100vh" p="8">
      <WalletStarknet />
      <Text>account: {account}</Text>
      <Text>account(felt): {toBN(account)}</Text>
      <Divider />

      <Heading size="lg">Daily Bonus</Heading>
      <Text>elapsedLoginTime: {toNumber(elapsedLoginTime)}s</Text>
      <Button
        onClick={() => {
          if (!account) return;
          getReward({ args: [toBN(account)] });
        }}
      >
        Get Reward
      </Button>
      <Divider />

      <Heading size="lg">Daily Material</Heading>
      <Text>id: number</Text>
      <VStack>
        {myMaterials.map((material, i) => (
          <Text key={i}>{`${i}: ${material}`}</Text>
        ))}
      </VStack>
      <Divider />

      <Heading size="lg">Craft</Heading>
      <Button
        onClick={() => {
          craftSoil2Brick({ args: [toBN(account)] });
        }}
      >
        Soil to Brick
      </Button>
      <Divider />

      <Heading size="lg">Craft Material</Heading>
    </VStack>
  );
};

export default Index;
