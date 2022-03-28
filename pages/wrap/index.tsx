import type { NextPage } from "next";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Abi } from "starknet";
import {
  useStarknet,
  useContract,
  useStarknetCall,
  useStarknetInvoke,
  useStarknetTransactionManager,
} from "@starknet-react/core";
import { Box, Flex, IconButton, Spacer, useTheme, VStack } from "@chakra-ui/react";
import { craftMaterialAbi, dailyMaterialAbi, wrapAbi, wrapMaterialAbi } from "~/abi";
import { RiArrowLeftRightLine, RiArrowRightLine } from "react-icons/ri";
import BarLoader from "react-spinners/BarLoader";
import { WrapContractAddress } from "~/constants";
import { AppContext } from "~/contexts";
import { fetchWrapCraftMaterials, fetchWrapMaterials } from "~/utils/phi";
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
  const { transactions = [] } = useStarknetTransactionManager();
  const theme = useTheme();

  const [dailyMaterials, setDailyMaterials] = useState<number[]>([]);
  const [craftMaterials, setCraftMaterials] = useState<number[]>([]);
  const [wrapDailyMaterials, setWrapDailyMaterials] = useState<number[]>([]);
  const [wrapCraftMaterials, setWrapCraftMaterials] = useState<number[]>([]);
  const [isWrapping, setIsWrapping] = useState(false);
  const [wrapType, setWrapType] = useState<WrapType>("wrap");
  const [materialType, setMaterialType] = useState<MaterialType>("daily");
  const switchWrapType = useCallback(() => setWrapType((prev) => (prev === "wrap" ? "unwrap" : "wrap")), []);
  const switchMaterialTypeType = useCallback(
    () => setMaterialType((prev) => (prev === "daily" ? "craft" : "daily")),
    []
  );
  const swapByWrapType = useCallback((a, b): [x: any, y: any] => (wrapType === "wrap" ? [a, b] : [b, a]), [wrapType]);
  const label = swapByWrapType("meta", "phi");
  const card = swapByWrapType(<MetaCard />, <PhiCard />);
  const dailyInventry = swapByWrapType(dailyMaterials, wrapDailyMaterials);
  const craftInventry = swapByWrapType(craftMaterials, wrapCraftMaterials);

  const { invoke: wrapDailyMaterial, data: txWrapDailyMaterial } = useStarknetInvoke({
    contract: wrapContract,
    method: "batch_wrap_daily_material",
  });
  const { invoke: wrapCraftMaterial, data: txWrapCraftMaterial } = useStarknetInvoke({
    contract: wrapContract,
    method: "batch_wrap_craft_material",
  });
  const { invoke: unwrapDailyMaterial, data: txUnwrapDailyMaterial } = useStarknetInvoke({
    contract: wrapContract,
    method: "batch_unwrap_daily_material",
  });
  const { invoke: unwrapCraftMaterial, data: txUnwrapCraftMaterial } = useStarknetInvoke({
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

  useEffect(() => {
    if (transactions.length <= 0) return;

    transactions.forEach((tx) => {
      const txHashs = [txWrapDailyMaterial, txWrapCraftMaterial, txUnwrapDailyMaterial, txUnwrapCraftMaterial];
      if (txHashs.includes(tx.transactionHash)) {
        setIsWrapping(tx.status !== "ACCEPTED_ON_L2");
      }
    });
  }, [transactions, txWrapDailyMaterial, txWrapCraftMaterial, txUnwrapDailyMaterial, txUnwrapCraftMaterial]);

  return (
    <Flex w="100%" h="100%" justify="space-evenly" align="center" pr="32" pb="8">
      <VStack h="100%" align="flex-start" justify="space-evenly">
        {card[0]}
        <Inventry
          label={label[0]}
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
          isDisabled={isWrapping}
          onClick={switchWrapType}
        >
          <RiArrowLeftRightLine
            size="16"
            cursor="pointer"
            color={theme.colors.white}
            style={wrapType === "wrap" ? {} : { transform: "scale(-1, 1)" }}
          />
        </IconButton>
        {isWrapping ? (
          <Flex w="32" h="10" alignItems="center" justifyContent="space-evenly">
            <BarLoader color={theme.colors.primary[100]} loading={isWrapping} />
          </Flex>
        ) : (
          <Button
            w="32"
            h="10"
            borderRadius="3xl"
            bgColor="primary.100"
            onClick={wrap}
            alignItems="center"
            justifyContent="space-between"
            rightIcon={<RiArrowRightLine />}
          >
            <Box />
            <Text fontSize="md" pb="1">
              {wrapType}
            </Text>
          </Button>
        )}
      </VStack>
      <VStack h="100%" align="flex-start" justify="space-evenly">
        {card[1]}
        <Inventry
          label={label[1]}
          dailyMaterials={dailyInventry[1]}
          craftMaterials={craftInventry[1]}
          wrapType={wrapType}
          materialType={materialType}
          cart={cart}
          readonly
          addCart={addCart}
          removeCart={removeCart}
        />
      </VStack>
    </Flex>
  );
};

export default Index;
