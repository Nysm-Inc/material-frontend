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
  const primitive0supply = usePrimitiveMaterialSupply(0);
  const primitive1supply = usePrimitiveMaterialSupply(1);
  const primitive2supply = usePrimitiveMaterialSupply(2);
  const primitive3supply = usePrimitiveMaterialSupply(3);
  const crafted0supply = useCraftedMaterialSupply(0);
  const crafted1supply = useCraftedMaterialSupply(1);
  const crafted2supply = useCraftedMaterialSupply(2);
  const crafted3supply = useCraftedMaterialSupply(3);
  const crafted4supply = useCraftedMaterialSupply(4);
  const crafted5supply = useCraftedMaterialSupply(5);
  const crafted6supply = useCraftedMaterialSupply(6);
  const crafted7supply = useCraftedMaterialSupply(7);

  const data = {
    labels: [...primitiveMaterialList, ...craftedMaterialList],
    datasets: [
      {
        label: "Total Supply",
        data: [
          primitive0supply,
          primitive1supply,
          primitive2supply,
          primitive3supply,
          crafted0supply,
          crafted1supply,
          crafted2supply,
          crafted3supply,
          crafted4supply,
          crafted5supply,
          crafted6supply,
          crafted7supply,
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
        {primitive0supply ? (
          <Bar options={options} data={data} />
        ) : (
          <BeatLoader color={theme.colors.gray[100]} size={12} />
        )}
      </Center>
    </Flex>
  );
};

export default Index;
