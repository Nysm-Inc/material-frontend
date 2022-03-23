import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Abi, hash, number } from "starknet";
import { useStarknet, useContract, useStarknetCall, useStarknetInvoke } from "@starknet-react/core";
import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Input,
  InputGroup,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { craftAbi, craftMaterialAbi, dailyBonusAbi, dailyMaterialAbi, wrapAbi } from "~/abi";
import WalletStarknet from "~/components/wallet/Starknet";
import {
  CraftContractAddress,
  CraftMaterialContractAddress,
  DailyBonusContractAddress,
  DailyMaterialContractAddress,
  starknetFeederGateway,
  WrapContractAddress,
} from "~/constants";
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
  const [dailyMaterials, setDailyMaterials] = useState<number[]>([]);
  const fetchDailyMaterials = useCallback(async () => {
    const len = 4;
    const owners = [...new Array(len)].map(() => toBN(account));
    const tokenIDs = [...new Array(len)].reduce((memo, _, i) => [...memo, toBN(i), toBN(0)], []);
    const res = await axios.post<{ result: string[] }>(starknetFeederGateway, {
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
      const materials = await fetchDailyMaterials();
      setDailyMaterials(materials);
    })();
  }, [account, fetchDailyMaterials]);

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
  const { contract: craftMaterialContract } = useContract({
    abi: craftMaterialAbi as Abi,
    address: CraftMaterialContractAddress,
  });
  const [craftMaterials, setCraftMaterials] = useState<number[]>([]);
  const fetchCraftMaterials = useCallback(async () => {
    const len = 7;
    const owners = [...new Array(len)].map(() => toBN(account));
    const tokenIDs = [...new Array(len)].reduce((memo, _, i) => [...memo, toBN(i), toBN(0)], []);
    const res = await axios.post<{ result: string[] }>(starknetFeederGateway, {
      signature: [],
      calldata: [toBN(len), ...owners, toBN(len), ...tokenIDs],
      contract_address: CraftMaterialContractAddress,
      entry_point_selector: number.toHex(hash.starknetKeccak("balance_of_batch")),
    });
    const materials = res.data.result.map((res) => toNumber(res));
    materials.shift();
    return materials;
  }, [account]);

  useEffect(() => {
    if (!account) return;

    (async () => {
      const materials = await fetchCraftMaterials();
      setCraftMaterials(materials);
    })();
  }, [account, fetchCraftMaterials]);

  // -------- Wrap --------
  const { contract: wrapContract } = useContract({
    abi: wrapAbi as Abi,
    address: WrapContractAddress,
  });
  const [dailyMaterialID, setDailyMaterialID] = useState(0);
  const { invoke: wrapDailyMaterial } = useStarknetInvoke({
    contract: wrapContract,
    method: "wrap_daily_material",
  });

  const [craftMaterialID, setCraftMaterialID] = useState(0);
  const { invoke: wrapCraftMaterial } = useStarknetInvoke({
    contract: wrapContract,
    method: "wrap_craft_material",
  });

  return (
    <VStack w="100vw" p="8">
      <WalletStarknet />
      <Text>account: {account}</Text>
      <Text>account(felt): {toBN(account)}</Text>
      <Divider />

      <Heading size="lg">Daily Bonus</Heading>
      <Text>elapsed login time: {toNumber(elapsedLoginTime)}s</Text>
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
        {dailyMaterials.map((num, id) => (
          <Text key={id}>{`${id}: ${num}`}</Text>
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
      <Text>id: number</Text>
      <VStack>
        {craftMaterials.map((num, id) => (
          <Text key={id}>{`${id}: ${num}`}</Text>
        ))}
      </VStack>
      <Divider />

      <Heading size="lg">Wrap</Heading>
      <HStack>
        <Input
          w="48"
          h="8"
          type="number"
          placeholder="daily material id"
          onChange={(e) => setDailyMaterialID(Number(e.target.value))}
        />
        <Button
          onClick={() => {
            wrapDailyMaterial({ args: [toBN(account), [toBN(dailyMaterialID), toBN(0)], toBN(1)] });
          }}
        >
          Wrap Daily Material
        </Button>
      </HStack>
      <HStack>
        <Input
          w="48"
          h="8"
          type="number"
          placeholder="craft material id"
          onChange={(e) => setCraftMaterialID(Number(e.target.value))}
        />
        <Button
          onClick={() => {
            wrapCraftMaterial({ args: [toBN(account), [toBN(craftMaterialID), toBN(0)], toBN(1)] });
          }}
        >
          Wrap Daily Material
        </Button>
      </HStack>
      <Divider />

      <Heading size="lg">Wrap Material</Heading>
    </VStack>
  );
};

export default Index;
