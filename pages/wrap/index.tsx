import type { NextPage } from "next";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Abi } from "starknet";
import { useStarknet, useContract, useStarknetCall, useStarknetInvoke } from "@starknet-react/core";
import { Box, Button, Flex, VStack } from "@chakra-ui/react";
import { craftMaterialAbi, dailyMaterialAbi, wrapAbi, wrapMaterialAbi } from "~/abi";
import { RiArrowLeftRightLine, RiArrowRightLine } from "react-icons/ri";
import { WrapContractAddress } from "~/constants";
import { AppContext } from "~/contexts";
import { fetchWrapCraftMaterials, fetchWrapMaterials } from "./phi";
import { fetchCraftMaterials, fetchDailyMaterials } from "~/utils/material";
import Inventry from "~/components/wrap/Inventry";
import { Text } from "~/components/common";

type Mode = "wrap" | "unwrap";

const Index: NextPage = () => {
  const { account } = useContext(AppContext);
  const { contract: wrapContract } = useContract({
    abi: wrapAbi as Abi,
    address: WrapContractAddress,
  });

  const [dailyMaterials, setDailyMaterials] = useState<number[]>([]);
  const [craftMaterials, setCraftMaterials] = useState<number[]>([]);
  const [wrapDailyMaterials, setWrapDailyMaterials] = useState<number[]>([]);
  const [wrapCraftMaterials, setWrapCraftMaterials] = useState<number[]>([]);

  const [mode, setMode] = useState<Mode>("wrap");
  const switchMode = useCallback(() => setMode((prev) => (prev === "wrap" ? "unwrap" : "wrap")), []);
  const swapByMode = useCallback((a, b): [x: any, y: any] => (mode === "wrap" ? [a, b] : [b, a]), [mode]);
  const label = swapByMode("Meta", "Phi");
  const dailyInventry = swapByMode(dailyMaterials, wrapDailyMaterials);
  const craftInventry = swapByMode(craftMaterials, wrapCraftMaterials);

  const { invoke: wrapDailyMaterial } = useStarknetInvoke({
    contract: wrapContract,
    method: "wrap_daily_material",
  });
  const { invoke: wrapCraftMaterial } = useStarknetInvoke({
    contract: wrapContract,
    method: "wrap_craft_material",
  });
  const { invoke: unwrapDailyMaterial } = useStarknetInvoke({
    contract: wrapContract,
    method: "unwrap_daily_material",
  });
  const { invoke: unwrapCraftMaterial } = useStarknetInvoke({
    contract: wrapContract,
    method: "unwrap_craft_material",
  });

  useEffect(() => {
    if (!account) return;

    (async () => {
      const materials = await fetchDailyMaterials(account);
      setDailyMaterials(materials);
    })();
    (async () => {
      const materials = await fetchCraftMaterials(account);
      setCraftMaterials(materials);
    })();
    (async () => {
      const materials = await fetchWrapMaterials(account);
      setWrapDailyMaterials(materials);
    })();
    (async () => {
      const materials = await fetchWrapCraftMaterials(account);
      setWrapCraftMaterials(materials);
    })();
  }, [account]);

  return (
    <Flex w="100%" h="100%" justify="space-evenly" align="center">
      <VStack>
        <Text fontSize="3xl">{label[0]}</Text>
        <Inventry dailyMaterials={dailyInventry[0]} craftMaterials={craftInventry[0]} />
      </VStack>
      <VStack>
        <RiArrowLeftRightLine size="32" cursor="pointer" onClick={switchMode} />
        <Button w="24">{mode}</Button>
        <RiArrowRightLine size="32" />
      </VStack>
      <VStack>
        <Text fontSize="3xl">{label[1]}</Text>
        <Inventry dailyMaterials={dailyInventry[1]} craftMaterials={craftInventry[1]} />
      </VStack>
    </Flex>
  );
};

export default Index;
