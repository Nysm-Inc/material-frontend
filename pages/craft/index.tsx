import type { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import { Text, VStack, Flex, Tag, TagLabel } from "@chakra-ui/react";
import { AppContext } from "~/contexts";
import { craftMaterialList, dailyMaterialList, receipes, ElapsedStakeTime } from "~/types";
import { fetchCraftMaterials, fetchDailyMaterials, fetchElapsedStakeTime } from "~/utils/material";
import Receipe from "~/components/craft/Receipe";
import { Table, Thead, Tbody, Tr, Th, Td } from "~/components/common";

const Index: NextPage = () => {
  const { account } = useContext(AppContext);
  const [dailyMaterials, setDailyMaterials] = useState<number[]>([]);
  const [craftMaterials, setCraftMaterials] = useState<number[]>([]);
  const [elapsedStakeTime, setElapsedStakeTime] = useState<ElapsedStakeTime>({ soilAndWood: 0, iron: 0, oil: 0 });

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

  useEffect(() => {
    if (!account) return;

    (async () => {
      const time = await fetchElapsedStakeTime(account, "check_elapsed_stake_time_soilAndSeed_2_wood");
      setElapsedStakeTime((prev) => {
        return { ...prev, soilAndWood: time };
      });
    })();
    (async () => {
      const time = await fetchElapsedStakeTime(account, "check_elapsed_stake_time_iron_2_steel");
      setElapsedStakeTime((prev) => {
        return { ...prev, iron: time };
      });
    })();
    (async () => {
      const time = await fetchElapsedStakeTime(account, "check_elapsed_stake_time_oil_2_plastic");
      setElapsedStakeTime((prev) => {
        return { ...prev, oil: time };
      });
    })();
  }, [account]);

  return (
    <Flex w="100%" h="100%" justifyContent="space-evenly">
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
              <Receipe
                key={i}
                receipe={receipe}
                dailyMaterials={dailyMaterials}
                craftMaterials={craftMaterials}
                elapsedStakeTime={elapsedStakeTime}
              >
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
          <Thead h="8">
            <Tr>
              <Th w="24">Name</Th>
              <Th w="40">Balance</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dailyMaterialList.map((name, i) => (
              <Tr key={i} h="12" bgColor="blackAlpha.600">
                <Td>{name}</Td>
                <Td>{dailyMaterials[i] || 0}</Td>
              </Tr>
            ))}
            {craftMaterialList.map((name, i) => (
              <Tr key={i} h="12" bgColor="blackAlpha.600">
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
