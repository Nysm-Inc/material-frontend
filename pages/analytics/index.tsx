import type { NextPage } from "next";
import { Box, Center, Flex, HStack, Spacer, useTheme } from "@chakra-ui/react";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";
import BeatLoader from "react-spinners/BeatLoader";
import { Text } from "~/components/common";
import { craftedMaterialList, primitiveMaterialList } from "~/types";
import { useCraftedMaterialSupply, usePrimitiveMaterialSupply } from "~/hooks/analytics";

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
  const { data: primitiveSupply, loading: loadingPrimitiveSupply } = usePrimitiveMaterialSupply();
  const { data: craftedSupply, loading: loadingCraftedSupply } = useCraftedMaterialSupply();

  const data = {
    labels: [...primitiveMaterialList, ...craftedMaterialList],
    datasets: [
      {
        label: "Total Supply",
        data: [
          primitiveSupply[0],
          primitiveSupply[2],
          primitiveSupply[4],
          primitiveSupply[6],
          craftedSupply[0],
          craftedSupply[2],
          craftedSupply[4],
          craftedSupply[6],
          craftedSupply[8],
          craftedSupply[10],
          craftedSupply[12],
          craftedSupply[14],
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
        {!loadingPrimitiveSupply && !loadingCraftedSupply ? (
          <Bar options={options} data={data} />
        ) : (
          <BeatLoader color={theme.colors.gray[100]} size={12} />
        )}
      </Center>
    </Flex>
  );
};

export default Index;
