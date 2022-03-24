import type { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import { Abi } from "starknet";
import { useContract, useStarknetCall, useStarknetInvoke } from "@starknet-react/core";
import { Text, VStack, Flex, Box, Tag, TagLabel } from "@chakra-ui/react";
import { craftAbi } from "~/abi";
import { CraftContractAddress } from "~/constants";
import { AppContext } from "~/contexts";
import { craftMaterialList, dailyMaterialList, receipes } from "~/types";
import { fetchCraftMaterials, fetchDailyMaterials } from "~/utils/material";
import Receipe from "~/components/craft/Receipe";
import { Table, Thead, Tbody, Tr, Th, Td } from "~/components/common";

const Index: NextPage = () => {
  const { account } = useContext(AppContext);
  const { contract: craftContract } = useContract({
    abi: craftAbi as Abi,
    address: CraftContractAddress,
  });
  const [dailyMaterials, setDailyMaterials] = useState<number[]>([]);
  const [craftMaterials, setCraftMaterials] = useState<number[]>([]);

  // const { data: elapsedTimeStakeSoilAndSeed } = useStarknetCall({
  //   contract: craftContract,
  //   method: "check_elapsed_stake_time_soilAndSeed_2_wood",
  // });

  useEffect(() => {
    if (!account) return;

    (async () => {
      const materials = await fetchDailyMaterials(account);
      setDailyMaterials(materials);
    })();
  }, [account]);

  useEffect(() => {
    if (!account) return;

    (async () => {
      const materials = await fetchCraftMaterials(account);
      setCraftMaterials(materials);
    })();
  }, [account]);

  return (
    <Flex w="100%" h="100%" justifyContent="space-evenly">
      {/* <VStack w="16%" align="flex-start">
        <Text fontSize="2xl" color="white">
          Category
        </Text>
        <VStack pl="2">
          <Text color="white">Material</Text>
          <Text color="white">Object</Text>
          <Text color="white">Weapon</Text>
        </VStack>
      </VStack> */}
      <VStack w="56%" align="flex-start">
        <Text fontSize="2xl" color="white">
          Receipes
        </Text>

        <Table>
          <Thead h="8">
            <Tr>
              <Th w="24">Name</Th>
              <Th w="64">Receipe</Th>
              <Th w="24">Type</Th>
              <Th w="40">Note</Th>
            </Tr>
          </Thead>
          <Tbody>
            {receipes.map((receipe, i) => (
              <Receipe key={i} receipe={receipe} dailyMaterials={dailyMaterials} craftMaterials={craftMaterials}>
                <Td>{receipe.name}</Td>
                <Td>{receipe.receipe}</Td>
                <Td>
                  <Tag
                    size="sm"
                    key={i}
                    borderRadius="full"
                    variant="solid"
                    color="black"
                    bgColor={receipe.type === "send" ? "green.100" : "yellow.100"}
                  >
                    <TagLabel>{receipe.type}</TagLabel>
                  </Tag>
                </Td>
                <Td>{receipe.note}</Td>
              </Receipe>
            ))}
          </Tbody>
        </Table>
      </VStack>
      <VStack w="24%" align="flex-start">
        <Text fontSize="2xl" color="white">
          Inventry
        </Text>
        <Table>
          <Thead>
            <Tr>
              <Th w="24">Name</Th>
              <Th w="40">Ammount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dailyMaterialList.map((name, i) => (
              <Tr key={i}>
                <Td>{name}</Td>
                <Td>{dailyMaterials[i] || 0}</Td>
              </Tr>
            ))}
            {craftMaterialList.map((name, i) => (
              <Tr key={i}>
                <Td>{name}</Td>
                <Td>{craftMaterials[i] || 0}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Flex>
  );
};

export default Index;
