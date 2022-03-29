// @ts-nocheck

import type { NextPage } from "next";
import { Box, Center, Flex, HStack, Spacer, useTheme } from "@chakra-ui/react";
import { useContract, useStarknetCall } from "@starknet-react/core";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";
import BeatLoader from "react-spinners/BeatLoader";
import { craftedMaterialAbi, primitiveMaterialAbi } from "~/abi";
import { Abi } from "starknet";
import { CraftedMaterialContractAddress, PrimitiveMaterialContractAddress } from "~/constants";
import { Text } from "~/components/common";
import { feltToNum, numToFelt } from "~/utils/cairo";
import { craftedMaterialList, primitiveMaterialList } from "~/types";

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {},
  },
  scales: {
    y: {
      min: 0,
      ticks: {
        color: "white",
        stepSize: 1,
      },
    },
    x: {
      ticks: {
        minRotation: 60,
        color: "white",
      },
    },
  },
};

const Index: NextPage = () => {
  const theme = useTheme();
  const { contract: primitiveMaterialContract } = useContract({
    abi: primitiveMaterialAbi as Abi,
    address: PrimitiveMaterialContractAddress,
  });
  const { data: primitiveToken0TotalSupply } = useStarknetCall({
    contract: primitiveMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(0), numToFelt(0)]],
  });
  const { data: primitiveToken1TotalSupply } = useStarknetCall({
    contract: primitiveMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(1), numToFelt(0)]],
  });
  const { data: primitiveToken2TotalSupply } = useStarknetCall({
    contract: primitiveMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(2), numToFelt(0)]],
  });
  const { data: primitiveToken3TotalSupply } = useStarknetCall({
    contract: primitiveMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(3), numToFelt(0)]],
  });
  const token0supply = feltToNum(primitiveToken0TotalSupply?.totalSupply?.low);
  const token1supply = feltToNum(primitiveToken1TotalSupply?.totalSupply?.low);
  const token2supply = feltToNum(primitiveToken2TotalSupply?.totalSupply?.low);
  const token3supply = feltToNum(primitiveToken3TotalSupply?.totalSupply?.low);

  const { contract: craftedMaterialContract } = useContract({
    abi: craftedMaterialAbi as Abi,
    address: CraftedMaterialContractAddress,
  });
  const { data: carftToken0TotalSupply } = useStarknetCall({
    contract: craftedMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(0), numToFelt(0)]],
  });
  const { data: carftToken1TotalSupply } = useStarknetCall({
    contract: craftedMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(1), numToFelt(0)]],
  });
  const { data: carftToken2TotalSupply } = useStarknetCall({
    contract: craftedMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(2), numToFelt(0)]],
  });
  const { data: carftToken3TotalSupply } = useStarknetCall({
    contract: craftedMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(3), numToFelt(0)]],
  });
  const { data: carftToken4TotalSupply } = useStarknetCall({
    contract: craftedMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(4), numToFelt(0)]],
  });
  const { data: carftToken5TotalSupply } = useStarknetCall({
    contract: craftedMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(5), numToFelt(0)]],
  });
  const { data: carftToken6TotalSupply } = useStarknetCall({
    contract: craftedMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(6), numToFelt(0)]],
  });
  const { data: carftToken7TotalSupply } = useStarknetCall({
    contract: craftedMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(7), numToFelt(0)]],
  });
  const craftedToken0supply = feltToNum(carftToken0TotalSupply?.totalSupply?.low);
  const craftedToken1supply = feltToNum(carftToken1TotalSupply?.totalSupply?.low);
  const craftedToken2supply = feltToNum(carftToken2TotalSupply?.totalSupply?.low);
  const craftedToken3supply = feltToNum(carftToken3TotalSupply?.totalSupply?.low);
  const craftedToken4supply = feltToNum(carftToken4TotalSupply?.totalSupply?.low);
  const craftedToken5supply = feltToNum(carftToken5TotalSupply?.totalSupply?.low);
  const craftedToken6supply = feltToNum(carftToken6TotalSupply?.totalSupply?.low);
  const craftedToken7supply = feltToNum(carftToken7TotalSupply?.totalSupply?.low);

  const data = {
    labels: [...primitiveMaterialList, ...craftedMaterialList],
    datasets: [
      {
        label: "Total Supply",
        data: [
          token0supply,
          token1supply,
          token2supply,
          token3supply,
          craftedToken0supply,
          craftedToken1supply,
          craftedToken2supply,
          craftedToken3supply,
          craftedToken4supply,
          craftedToken5supply,
          craftedToken6supply,
          craftedToken7supply,
        ],
        backgroundColor: [
          theme.colors.green[100],
          theme.colors.green[100],
          theme.colors.green[100],
          theme.colors.green[100],
          theme.colors.yellow[100],
          theme.colors.yellow[100],
          theme.colors.yellow[100],
          theme.colors.yellow[100],
          theme.colors.yellow[100],
          theme.colors.yellow[100],
          theme.colors.yellow[100],
          theme.colors.yellow[100],
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Flex w="100%" h="100%" pr="24" justify="center" align="center" direction="column">
      <Text fontSize="2xl">Material Total Supply</Text>
      <Box h="2" />
      <HStack>
        <Flex align="center">
          <Box w="8" h="3" bgColor="green.100" />
          <Spacer w="1" />
          <Text>Primitive Material</Text>
        </Flex>
        <Flex align="center">
          <Box w="8" h="3" bgColor="yellow.100" />
          <Spacer w="1" />
          <Text>Crafted Material</Text>
        </Flex>
      </HStack>
      <Box h="16" />
      <Center w="4xl" h="md">
        {token0supply ? <Bar options={options} data={data} /> : <BeatLoader color={theme.colors.gray[100]} size={12} />}
      </Center>
    </Flex>
  );
};

export default Index;
