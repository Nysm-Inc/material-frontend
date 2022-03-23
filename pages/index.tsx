import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Abi, hash, number } from "starknet";
import { useStarknet, useContract, useStarknetCall, useStarknetInvoke } from "@starknet-react/core";
import { Box, Button, Divider, Flex, Heading, HStack, Input, Link, Text, VStack } from "@chakra-ui/react";
import { craftAbi, craftMaterialAbi, dailyBonusAbi, dailyMaterialAbi, wrapAbi, wrapMaterialAbi } from "~/abi";
import WalletStarknet from "~/components/wallet/Starknet";
import {
  CraftContractAddress,
  CraftMaterialContractAddress,
  DailyBonusContractAddress,
  DailyMaterialContractAddress,
  starknetFeederGateway,
  WrapContractAddress,
  WrapCraftMaterialContractAddress,
  WrapMaterialContractAddress,
} from "~/constants";
import { toBN, toNumber } from "~/utils/cairo";
import { Github, Meta } from "~/public";
import Image from "next/image";

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
  const { invoke: craftBrick2BrickHouse } = useStarknetInvoke({
    contract: craftContract,
    method: "craft_brick_2_brickHouse",
  });
  const { invoke: craftSoilAndSeed2Wood } = useStarknetInvoke({
    contract: craftContract,
    method: "craft_soilAndSeed_2_wood",
  });
  const { invoke: craftIronAndWood2IronSword } = useStarknetInvoke({
    contract: craftContract,
    method: "craft_ironAndWood_2_ironSword",
  });
  const { invoke: stakeIron2Steel } = useStarknetInvoke({
    contract: craftContract,
    method: "stake_iron_2_steel",
  });
  const { invoke: craftIron2Steel } = useStarknetInvoke({
    contract: craftContract,
    method: "craft_iron_2_steel",
  });
  const { invoke: craftOil2Plastic } = useStarknetInvoke({
    contract: craftContract,
    method: "craft_oil_2_plastic",
  });
  const { invoke: craftPlasticAndSteel2Computer } = useStarknetInvoke({
    contract: craftContract,
    method: "craft_plasticAndSteel_2_computer",
  });
  const { invoke: craftComputer2ElectronicsStore } = useStarknetInvoke({
    contract: craftContract,
    method: "craft_computer_2_electronicsStore",
  });

  // -------- Craft Material --------
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
  const [wrapDailyMaterialID, setWrapDailyMaterialID] = useState(0);
  const { invoke: wrapDailyMaterial } = useStarknetInvoke({
    contract: wrapContract,
    method: "wrap_daily_material",
  });
  const [wrapCraftMaterialID, setWrapCraftMaterialID] = useState(0);
  const { invoke: wrapCraftMaterial } = useStarknetInvoke({
    contract: wrapContract,
    method: "wrap_craft_material",
  });
  const [unwrapDailyMaterialID, setUnwrapDailyMaterialID] = useState(0);
  const { invoke: unwrapDailyMaterial } = useStarknetInvoke({
    contract: wrapContract,
    method: "unwrap_daily_material",
  });
  const [unwrapCraftMaterialID, setUnwrapCraftMaterialID] = useState(0);
  const { invoke: unwrapCraftMaterial } = useStarknetInvoke({
    contract: wrapContract,
    method: "unwrap_craft_material",
  });

  // -------- Wrap Material --------
  const [wrapMaterials, setWrapMaterials] = useState<number[]>([]);
  const fetchWrapMaterials = useCallback(async () => {
    const len = 4;
    const owners = [...new Array(len)].map(() => toBN(account));
    const tokenIDs = [...new Array(len)].reduce((memo, _, i) => [...memo, toBN(i), toBN(0)], []);
    const res = await axios.post<{ result: string[] }>(starknetFeederGateway, {
      signature: [],
      calldata: [toBN(len), ...owners, toBN(len), ...tokenIDs],
      contract_address: WrapMaterialContractAddress,
      entry_point_selector: number.toHex(hash.starknetKeccak("balance_of_batch")),
    });
    const materials = res.data.result.map((res) => toNumber(res));
    materials.shift();
    return materials;
  }, [account]);

  useEffect(() => {
    if (!account) return;

    (async () => {
      const materials = await fetchWrapMaterials();
      setWrapMaterials(materials);
    })();
  }, [account, fetchWrapMaterials]);

  // -------- Wrap Craft Material --------
  const [wrapCraftMaterials, setWrapCraftMaterials] = useState<number[]>([]);
  const fetchWrapCraftMaterials = useCallback(async () => {
    const len = 7;
    const owners = [...new Array(len)].map(() => toBN(account));
    const tokenIDs = [...new Array(len)].reduce((memo, _, i) => [...memo, toBN(i), toBN(0)], []);
    const res = await axios.post<{ result: string[] }>(starknetFeederGateway, {
      signature: [],
      calldata: [toBN(len), ...owners, toBN(len), ...tokenIDs],
      contract_address: WrapCraftMaterialContractAddress,
      entry_point_selector: number.toHex(hash.starknetKeccak("balance_of_batch")),
    });
    const materials = res.data.result.map((res) => toNumber(res));
    materials.shift();
    return materials;
  }, [account]);

  useEffect(() => {
    if (!account) return;

    (async () => {
      const materials = await fetchWrapCraftMaterials();
      setWrapCraftMaterials(materials);
    })();
  }, [account, fetchWrapCraftMaterials]);

  return (
    <VStack w="100vw">
      <Flex
        w="100%"
        h="16"
        justifyContent="space-between"
        alignItems="center"
        pl="6"
        pr="6"
        borderBottom="solid 1px"
        borderColor="gray.100"
      >
        <HStack>
          <Image width="32px" height="32px" src={Meta} />
          <Text>Meta | Material</Text>
        </HStack>
        <WalletStarknet />
      </Flex>

      <Heading size="lg">
        <Link href={`https://goerli.voyager.online/contract/${DailyBonusContractAddress}`} isExternal>
          Daily Bonus
        </Link>
      </Heading>
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

      <Heading size="lg">
        <Link href={`https://goerli.voyager.online/contract/${DailyMaterialContractAddress}`} isExternal>
          Daily Material
        </Link>
      </Heading>
      <Text>id: number</Text>
      <VStack>
        {dailyMaterials.map((num, id) => (
          <Text key={id}>{`${id}: ${num}`}</Text>
        ))}
      </VStack>
      <Divider />

      <Heading size="lg">
        <Link href={`https://goerli.voyager.online/contract/${CraftContractAddress}`} isExternal>
          Craft
        </Link>
      </Heading>
      <Button
        onClick={() => {
          craftSoil2Brick({ args: [toBN(account)] });
        }}
      >
        Soil to Brick
      </Button>
      <Button
        onClick={() => {
          craftBrick2BrickHouse({ args: [toBN(account)] });
        }}
      >
        Brick to BrickHouse
      </Button>
      <Button
        onClick={() => {
          craftSoilAndSeed2Wood({ args: [toBN(account)] });
        }}
      >
        SoilAndSeed to Wood
      </Button>
      <Button
        onClick={() => {
          craftIronAndWood2IronSword({ args: [toBN(account)] });
        }}
      >
        IronAndWood to IronSword
      </Button>
      <Button
        onClick={() => {
          stakeIron2Steel({ args: [toBN(account)] });
        }}
      >
        Stake Iron To Steel
      </Button>
      <Button
        onClick={() => {
          craftIron2Steel({ args: [toBN(account)] });
        }}
      >
        Iron to Steel
      </Button>
      <Button
        onClick={() => {
          craftOil2Plastic({ args: [toBN(account)] });
        }}
      >
        Oil to Plastic
      </Button>
      <Button
        onClick={() => {
          craftPlasticAndSteel2Computer({ args: [toBN(account)] });
        }}
      >
        PlasticAndSteel to Computer
      </Button>
      <Button
        onClick={() => {
          craftComputer2ElectronicsStore({ args: [toBN(account)] });
        }}
      >
        Computer to ElectronicsStore
      </Button>
      <Divider />

      <Heading size="lg">
        <Link href={`https://goerli.voyager.online/contract/${CraftMaterialContractAddress}`} isExternal>
          Craft Material
        </Link>
      </Heading>
      <Text>id: number</Text>
      <VStack>
        {craftMaterials.map((num, id) => (
          <Text key={id}>{`${id}: ${num}`}</Text>
        ))}
      </VStack>
      <Divider />

      <Heading size="lg">
        <Link href={`https://goerli.voyager.online/contract/${WrapContractAddress}`} isExternal>
          Wrap
        </Link>
      </Heading>
      <HStack>
        <Input
          w="48"
          h="8"
          type="number"
          placeholder="daily material id"
          onChange={(e) => setWrapDailyMaterialID(Number(e.target.value))}
        />
        <Button
          onClick={() => {
            wrapDailyMaterial({ args: [toBN(account), [toBN(wrapDailyMaterialID), toBN(0)], toBN(1)] });
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
          onChange={(e) => setWrapCraftMaterialID(Number(e.target.value))}
        />
        <Button
          onClick={() => {
            wrapCraftMaterial({ args: [toBN(account), [toBN(wrapCraftMaterialID), toBN(0)], toBN(1)] });
          }}
        >
          Wrap Craft Material
        </Button>
      </HStack>
      <HStack>
        <Input
          w="48"
          h="8"
          type="number"
          placeholder="daily material id"
          onChange={(e) => setUnwrapDailyMaterialID(Number(e.target.value))}
        />
        <Button
          onClick={() => {
            unwrapDailyMaterial({ args: [toBN(account), [toBN(unwrapDailyMaterialID), toBN(0)], toBN(1)] });
          }}
        >
          Unwrap Daily Material
        </Button>
      </HStack>
      <HStack>
        <Input
          w="48"
          h="8"
          type="number"
          placeholder="craft material id"
          onChange={(e) => setUnwrapCraftMaterialID(Number(e.target.value))}
        />
        <Button
          onClick={() => {
            unwrapCraftMaterial({ args: [toBN(account), [toBN(unwrapCraftMaterialID), toBN(0)], toBN(1)] });
          }}
        >
          Unwrap Craft Material
        </Button>
      </HStack>
      <Divider />

      <Heading size="lg">
        <Link href={`https://goerli.voyager.online/contract/${WrapMaterialContractAddress}`} isExternal>
          Wrap Material
        </Link>
      </Heading>
      <Text>id: number</Text>
      <VStack>
        {wrapMaterials.map((num, id) => (
          <Text key={id}>{`${id}: ${num}`}</Text>
        ))}
      </VStack>
      <Divider />

      <Heading size="lg">
        <Link href={`https://goerli.voyager.online/contract/${WrapCraftMaterialContractAddress}`} isExternal>
          Wrap Craft Material
        </Link>
      </Heading>
      <Text>id: number</Text>
      <VStack>
        {wrapCraftMaterials.map((num, id) => (
          <Text key={id}>{`${id}: ${num}`}</Text>
        ))}
      </VStack>
      <Divider />

      <Flex w="100%" h="16" justifyContent="space-between" alignItems="center" pl="6" pr="6">
        <Box />
        <Link href="https://github.com/Nysm-Inc/material-frontend" isExternal>
          <Image width="32px" height="32px" src={Github} />
        </Link>
      </Flex>
    </VStack>
  );
};

export default Index;
