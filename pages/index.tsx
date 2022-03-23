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
import { numToFelt, feltToNum } from "~/utils/cairo";
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
    args: [numToFelt(account)],
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
    const owners = [...new Array(len)].map(() => numToFelt(account));
    const tokenIDs = [...new Array(len)].reduce((memo, _, i) => [...memo, numToFelt(i), numToFelt(0)], []);
    const res = await axios.post<{ result: string[] }>(starknetFeederGateway, {
      signature: [],
      calldata: [numToFelt(len), ...owners, numToFelt(len), ...tokenIDs],
      contract_address: DailyMaterialContractAddress,
      entry_point_selector: number.toHex(hash.starknetKeccak("balance_of_batch")),
    });
    const materials = res.data.result.map((res) => feltToNum(res));
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
    const len = 8;
    const owners = [...new Array(len)].map(() => numToFelt(account));
    const tokenIDs = [...new Array(len)].reduce((memo, _, i) => [...memo, numToFelt(i), numToFelt(0)], []);
    const res = await axios.post<{ result: string[] }>(starknetFeederGateway, {
      signature: [],
      calldata: [numToFelt(len), ...owners, numToFelt(len), ...tokenIDs],
      contract_address: CraftMaterialContractAddress,
      entry_point_selector: number.toHex(hash.starknetKeccak("balance_of_batch")),
    });
    const materials = res.data.result.map((res) => feltToNum(res));
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

  const [isCraftable, setIsCraftable] = useState([...new Array(9)].map(() => false));
  useEffect(() => {
    const condition = [...new Array(9)].map(() => false);
    condition[0] = dailyMaterials[0] >= 4;
    condition[1] = craftMaterials[0] >= 4;
    condition[2] = dailyMaterials[0] >= 2 && dailyMaterials[2] >= 2;
    condition[3] = dailyMaterials[3] >= 1 && craftMaterials[2] >= 1;
    condition[4] = dailyMaterials[3] >= 1;
    condition[5] = false; // ???
    condition[6] = dailyMaterials[1] >= 1;
    condition[7] = craftMaterials[5] >= 2 && craftMaterials[4] >= 1;
    condition[8] = craftMaterials[6] >= 4;

    setIsCraftable(condition);
  }, [dailyMaterials, craftMaterials]);

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
      <Text>elapsed login time: {feltToNum(elapsedLoginTime)}s</Text>
      <Button
        onClick={() => {
          if (!account) return;
          getReward({ args: [numToFelt(account)] });
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
        disabled={!isCraftable[0]}
        onClick={() => {
          craftSoil2Brick({ args: [numToFelt(account)] });
        }}
      >
        Soil to Brick
      </Button>
      <Button
        disabled={!isCraftable[1]}
        onClick={() => {
          craftBrick2BrickHouse({ args: [numToFelt(account)] });
        }}
      >
        Brick to BrickHouse
      </Button>
      <Button
        disabled={!isCraftable[2]}
        onClick={() => {
          craftSoilAndSeed2Wood({ args: [numToFelt(account)] });
        }}
      >
        SoilAndSeed to Wood
      </Button>
      <Button
        disabled={!isCraftable[3]}
        onClick={() => {
          craftIronAndWood2IronSword({ args: [numToFelt(account)] });
        }}
      >
        IronAndWood to IronSword
      </Button>
      <Button
        disabled={!isCraftable[4]}
        onClick={() => {
          stakeIron2Steel({ args: [numToFelt(account)] });
        }}
      >
        Stake Iron To Steel
      </Button>
      <Button
        disabled={!isCraftable[5]}
        onClick={() => {
          craftIron2Steel({ args: [numToFelt(account)] });
        }}
      >
        Iron to Steel
      </Button>
      <Button
        disabled={!isCraftable[6]}
        onClick={() => {
          craftOil2Plastic({ args: [numToFelt(account)] });
        }}
      >
        Oil to Plastic
      </Button>
      <Button
        disabled={!isCraftable[7]}
        onClick={() => {
          craftPlasticAndSteel2Computer({ args: [numToFelt(account)] });
        }}
      >
        PlasticAndSteel to Computer
      </Button>
      <Button
        disabled={!isCraftable[8]}
        onClick={() => {
          craftComputer2ElectronicsStore({ args: [numToFelt(account)] });
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
            wrapDailyMaterial({
              args: [numToFelt(account), [numToFelt(wrapDailyMaterialID), numToFelt(0)], numToFelt(1)],
            });
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
            wrapCraftMaterial({
              args: [numToFelt(account), [numToFelt(wrapCraftMaterialID), numToFelt(0)], numToFelt(1)],
            });
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
            unwrapDailyMaterial({
              args: [numToFelt(account), [numToFelt(unwrapDailyMaterialID), numToFelt(0)], numToFelt(1)],
            });
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
            unwrapCraftMaterial({
              args: [numToFelt(account), [numToFelt(unwrapCraftMaterialID), numToFelt(0)], numToFelt(1)],
            });
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
