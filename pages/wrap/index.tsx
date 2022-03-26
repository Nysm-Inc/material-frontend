import type { NextPage } from "next";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Abi } from "starknet";
import { useStarknet, useContract, useStarknetCall, useStarknetInvoke } from "@starknet-react/core";
import { Box, Flex, IconButton, Spacer, useTheme, VStack } from "@chakra-ui/react";
import { craftMaterialAbi, dailyMaterialAbi, wrapAbi, wrapMaterialAbi } from "~/abi";
import { RiArrowLeftRightLine, RiArrowRightLine } from "react-icons/ri";
import BarLoader from "react-spinners/BarLoader";
import { WrapContractAddress } from "~/constants";
import { AppContext } from "~/contexts";
import { fetchWrapCraftMaterials, fetchWrapMaterials } from "./phi";
import { fetchCraftMaterials, fetchDailyMaterials } from "~/utils/material";
import { MetaCard, PhiCard, Inventry } from "~/components/wrap";
import { Button, Text } from "~/components/common";
import { numToFelt } from "~/utils/cairo";
import { Cart, craftMaterialList, dailyMaterialList, MaterialType, WrapType } from "~/types";

const Index: NextPage = () => {
  const { account } = useContext(AppContext);
  const { contract: wrapContract } = useContract({
    abi: wrapAbi as Abi,
    address: WrapContractAddress,
  });
  const theme = useTheme();

  const [dailyMaterials, setDailyMaterials] = useState<number[]>([]);
  const [craftMaterials, setCraftMaterials] = useState<number[]>([]);
  const [wrapDailyMaterials, setWrapDailyMaterials] = useState<number[]>([]);
  const [wrapCraftMaterials, setWrapCraftMaterials] = useState<number[]>([]);

  const [wrapType, setWrapType] = useState<WrapType>("wrap");
  const [materialType, setMaterialType] = useState<MaterialType>("daily");
  const switchWrapType = useCallback(() => setWrapType((prev) => (prev === "wrap" ? "unwrap" : "wrap")), []);
  const switchMaterialTypeType = useCallback(
    () => setMaterialType((prev) => (prev === "daily" ? "craft" : "daily")),
    []
  );
  const swapByWrapType = useCallback((a, b): [x: any, y: any] => (wrapType === "wrap" ? [a, b] : [b, a]), [wrapType]);
  const card = swapByWrapType(<MetaCard />, <PhiCard />);
  const dailyInventry = swapByWrapType(dailyMaterials, wrapDailyMaterials);
  const craftInventry = swapByWrapType(craftMaterials, wrapCraftMaterials);

  const { invoke: wrapDailyMaterial } = useStarknetInvoke({
    contract: wrapContract,
    method: "batch_wrap_daily_material",
  });
  const { invoke: wrapCraftMaterial } = useStarknetInvoke({
    contract: wrapContract,
    method: "batch_wrap_craft_material",
  });
  const { invoke: unwrapDailyMaterial } = useStarknetInvoke({
    contract: wrapContract,
    method: "batch_unwrap_daily_material",
  });
  const { invoke: unwrapCraftMaterial } = useStarknetInvoke({
    contract: wrapContract,
    method: "batch_unwrap_craft_material",
  });

  const [cart, setCart] = useState<Cart>({
    wrap: {
      daily: [...new Array(dailyMaterialList.length)].fill(0),
      craft: [...new Array(craftMaterialList.length)].fill(0),
    },
    unwrap: {
      daily: [...new Array(dailyMaterialList.length)].fill(0),
      craft: [...new Array(craftMaterialList.length)].fill(0),
    },
  });
  const addCart = useCallback(
    (id: number) => {
      setCart((prev) => {
        const copied = prev[wrapType][materialType].map((d) => d);
        copied[id] += 1;
        return {
          ...prev,
          [wrapType]: { ...prev[wrapType], [materialType]: copied },
        };
      });
    },
    [wrapType, materialType]
  );
  const removeCart = useCallback(
    (id: number) => {
      setCart((prev) => {
        const copied = prev[wrapType][materialType].map((d) => d);
        copied[id] = copied[id] > 0 ? copied[id] - 1 : copied[id];
        return { ...prev, [wrapType]: { ...prev[wrapType], [materialType]: copied } };
      });
    },
    [wrapType, materialType]
  );
  const wrap = () => {
    let tokenIDs: string[][] = [];
    let amounts: string[] = [];
    cart[wrapType][materialType].forEach((num, id) => {
      if (num > 0) {
        tokenIDs.push([numToFelt(id), numToFelt(0)]);
        amounts.push(num.toString());
      }
    });

    if (wrapType === "wrap") {
      if (materialType === "daily") {
        wrapDailyMaterial({ args: [numToFelt(account), tokenIDs, amounts] });
      } else {
        wrapCraftMaterial({ args: [numToFelt(account), tokenIDs, amounts] });
      }
    } else {
      if (materialType === "daily") {
        unwrapDailyMaterial({ args: [numToFelt(account), tokenIDs, amounts] });
      } else {
        unwrapCraftMaterial({ args: [numToFelt(account), tokenIDs, amounts] });
      }
    }
  };

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
    <Flex w="100%" h="100%" justify="space-evenly" align="center" pr="32">
      <VStack h="100%" align="flex-start" justify="space-evenly">
        {card[0]}
        <Inventry
          dailyMaterials={dailyInventry[0]}
          craftMaterials={craftInventry[0]}
          wrapType={wrapType}
          materialType={materialType}
          cart={cart}
          addCart={addCart}
          removeCart={removeCart}
        />
      </VStack>
      <VStack h="100%" align="center" justify="space-evenly">
        <IconButton
          aria-label="wrap"
          borderRadius="3xl"
          bgColor="primary.100"
          _focus={{ border: "none" }}
          onClick={switchWrapType}
        >
          <RiArrowLeftRightLine size="16" cursor="pointer" color={theme.colors.white} />
        </IconButton>
        <Button
          w="32"
          h="10"
          fontSize="lg"
          borderRadius="3xl"
          bgColor="primary.100"
          onClick={wrap}
          alignItems="center"
          justifyContent="space-between"
          rightIcon={<RiArrowRightLine />}
        >
          <Box />
          {wrapType}
        </Button>
        {/* <BarLoader color={theme.colors.primary[100]} loading={true} /> */}
        {/* <Text>{wrapType}ping...</Text> */}
      </VStack>
      <VStack h="100%" align="flex-start" justify="space-evenly">
        {card[1]}
        <Inventry
          dailyMaterials={dailyInventry[1]}
          craftMaterials={craftInventry[1]}
          wrapType={wrapType}
          materialType={materialType}
          cart={cart}
          addCart={addCart}
          removeCart={removeCart}
          hideCart
        />
      </VStack>
    </Flex>
  );
};

export default Index;
