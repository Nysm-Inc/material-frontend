// @ts-nocheck

import type { NextPage } from "next";
import { Box, Center, useTheme } from "@chakra-ui/react";
import { useContract, useStarknetCall } from "@starknet-react/core";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";
import BeatLoader from "react-spinners/BeatLoader";
import { craftMaterialAbi, dailyMaterialAbi, wrapCraftMaterialAbi, wrapMaterialAbi } from "~/abi";
import { Abi } from "starknet";
import {
  CraftMaterialContractAddress,
  DailyMaterialContractAddress,
  WrapCraftMaterialContractAddress,
  WrapMaterialContractAddress,
} from "~/constants";
import { Text } from "~/components/common";
import { feltToNum, numToFelt } from "~/utils/cairo";
import { craftMaterialList, dailyMaterialList } from "~/types";

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: "top",
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      min: 0,
      ticks: {
        color: "white",
      },
    },
    x: {
      ticks: {
        minRotation: 90,
        color: "white",
      },
    },
  },
};

const Index: NextPage = () => {
  const theme = useTheme();
  const { contract: dailyMaterialContract } = useContract({
    abi: dailyMaterialAbi as Abi,
    address: DailyMaterialContractAddress,
  });
  // const { data: _dailyTotalSupply } = useStarknetCall({
  //   contract: dailyMaterialContract,
  //   method: "ERC1155_Enumerable_totalSupply",
  //   args: [],
  // });
  // const dailyTotalSupply = feltToNum(_dailyTotalSupply?.totalSupply?.low);
  const { data: dailyToken0TotalSupply } = useStarknetCall({
    contract: dailyMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(0), numToFelt(0)]],
  });
  const { data: dailyToken1TotalSupply } = useStarknetCall({
    contract: dailyMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(1), numToFelt(0)]],
  });
  const { data: dailyToken2TotalSupply } = useStarknetCall({
    contract: dailyMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(2), numToFelt(0)]],
  });
  const { data: dailyToken3TotalSupply } = useStarknetCall({
    contract: dailyMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(3), numToFelt(0)]],
  });
  const token0supply = feltToNum(dailyToken0TotalSupply?.totalSupply?.low);
  const token1supply = feltToNum(dailyToken1TotalSupply?.totalSupply?.low);
  const token2supply = feltToNum(dailyToken2TotalSupply?.totalSupply?.low);
  const token3supply = feltToNum(dailyToken3TotalSupply?.totalSupply?.low);

  const { contract: craftMaterialContract } = useContract({
    abi: craftMaterialAbi as Abi,
    address: CraftMaterialContractAddress,
  });
  // const { data: _craftTotalSupply } = useStarknetCall({
  //   contract: craftMaterialContract,
  //   method: "ERC1155_Enumerable_totalSupply",
  //   args: [],
  // });
  // const craftTotalSupply = feltToNum(_craftTotalSupply?.totalSupply?.low);
  const { data: carftToken0TotalSupply } = useStarknetCall({
    contract: craftMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(0), numToFelt(0)]],
  });
  const { data: carftToken1TotalSupply } = useStarknetCall({
    contract: craftMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(1), numToFelt(0)]],
  });
  const { data: carftToken2TotalSupply } = useStarknetCall({
    contract: craftMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(2), numToFelt(0)]],
  });
  const { data: carftToken3TotalSupply } = useStarknetCall({
    contract: craftMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(3), numToFelt(0)]],
  });
  const { data: carftToken4TotalSupply } = useStarknetCall({
    contract: craftMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(4), numToFelt(0)]],
  });
  const { data: carftToken5TotalSupply } = useStarknetCall({
    contract: craftMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(5), numToFelt(0)]],
  });
  const { data: carftToken6TotalSupply } = useStarknetCall({
    contract: craftMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(6), numToFelt(0)]],
  });
  const { data: carftToken7TotalSupply } = useStarknetCall({
    contract: craftMaterialContract,
    method: "ERC1155_Enumerable_token_totalSupply",
    args: [[numToFelt(7), numToFelt(0)]],
  });
  const craftToken0supply = feltToNum(carftToken0TotalSupply?.totalSupply?.low);
  const craftToken1supply = feltToNum(carftToken1TotalSupply?.totalSupply?.low);
  const craftToken2supply = feltToNum(carftToken2TotalSupply?.totalSupply?.low);
  const craftToken3supply = feltToNum(carftToken3TotalSupply?.totalSupply?.low);
  const craftToken4supply = feltToNum(carftToken4TotalSupply?.totalSupply?.low);
  const craftToken5supply = feltToNum(carftToken5TotalSupply?.totalSupply?.low);
  const craftToken6supply = feltToNum(carftToken6TotalSupply?.totalSupply?.low);
  const craftToken7supply = feltToNum(carftToken7TotalSupply?.totalSupply?.low);

  const data = {
    labels: [...dailyMaterialList, ...craftMaterialList],
    datasets: [
      {
        label: "Total Supply",
        data: [
          token0supply,
          token1supply,
          token2supply,
          token3supply,
          craftToken0supply,
          craftToken1supply,
          craftToken2supply,
          craftToken3supply,
          craftToken4supply,
          craftToken5supply,
          craftToken6supply,
          craftToken7supply,
        ],
        backgroundColor: theme.colors.gray[300],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Center w="100%" h="100%">
      <Center w="4xl">
        {token0supply ? <Bar options={options} data={data} /> : <BeatLoader color={theme.colors.gray[100]} size={12} />}
      </Center>
    </Center>
  );
};

export default Index;

// const { contract: wrapMaterialContract } = useContract({
//   abi: wrapMaterialAbi as Abi,
//   address: WrapMaterialContractAddress,
// });
// const { data: _wrapTotalSupply } = useStarknetCall({
//   contract: wrapMaterialContract,
//   method: "ERC1155_Enumerable_totalSupply",
//   args: [],
// });
// const wrapTotalSupply = feltToNum(_wrapTotalSupply?.totalSupply?.low);

// const { contract: wrapCraftMaterialContract } = useContract({
//   abi: wrapCraftMaterialAbi as Abi,
//   address: WrapCraftMaterialContractAddress,
// });
// const { data: _wrapCraftTotalSupply } = useStarknetCall({
//   contract: wrapCraftMaterialContract,
//   method: "ERC1155_Enumerable_totalSupply",
//   args: [],
// });
// const wrapCraftTotalSupply = feltToNum(_wrapCraftTotalSupply?.totalSupply?.low);
