import type { NextPage } from "next";
import { useContext } from "react";
import { Text, VStack, Flex } from "@chakra-ui/react";
import { AppContext } from "~/contexts";
import { craftedMaterialList, primitiveMaterialList, recipes, ElapsedForgeTime } from "~/types";
import Recipe from "~/components/craft/Recipe";
import { Table, Thead, Tbody, Tr, Th, Td, Button } from "~/components/common";
import { useCraftedeMaterials, usePrimitiveMaterials } from "~/hooks/material";
import { useElapsedForgeTime } from "~/hooks/craft";

const Index: NextPage = () => {
  const { account } = useContext(AppContext);
  const primitiveMaterials = usePrimitiveMaterials(account);
  const craftedMaterials = useCraftedeMaterials(account);
  const elapsedForgeTimeSoilAndSeed = useElapsedForgeTime(account, "check_elapsed_forge_time_soilAndSeed_2_wood");
  const elapsedForgeTimeIron = useElapsedForgeTime(account, "check_elapsed_forge_time_iron_2_steel");
  const elapsedForgeTimeOil = useElapsedForgeTime(account, "check_elapsed_forge_time_oil_2_plastic");
  const elapsedForgeTime: ElapsedForgeTime = {
    soilAndWood: elapsedForgeTimeSoilAndSeed,
    iron: elapsedForgeTimeIron,
    oil: elapsedForgeTimeOil,
  };

  return (
    <Flex w="100%" h="100%" justifyContent="space-evenly">
      <VStack w="56%" align="flex-start">
        <Text fontSize="2xl" color="white">
          Recipes
        </Text>

        <Table>
          <Thead h="8">
            <Tr>
              <Th w="24">Name</Th>
              <Th w="64">Recipe</Th>
              <Th w="40">Term</Th>
              <Th w="24" />
            </Tr>
          </Thead>
          <Tbody>
            {recipes.map((recipe, i) => (
              <Recipe
                key={i}
                recipe={recipe}
                primitiveMaterials={primitiveMaterials}
                craftedMaterials={craftedMaterials}
                elapsedForgeTime={elapsedForgeTime}
              >
                <Td>{recipe.name}</Td>
                <Td>{recipe.recipe}</Td>
                <Td>{recipe.note}</Td>
                <Td>
                  <Button
                    size="xs"
                    fontSize="xs"
                    borderRadius="full"
                    variant="solid"
                    color="white"
                    bgColor="primary.100"
                    disabled={!recipe.condition(primitiveMaterials, craftedMaterials, elapsedForgeTime)}
                  >
                    Craft
                  </Button>
                </Td>
              </Recipe>
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
            {primitiveMaterialList.map((name, i) => (
              <Tr key={i} h="12" bgColor="blackAlpha.600">
                <Td>{name}</Td>
                <Td>{primitiveMaterials[i] || 0}</Td>
              </Tr>
            ))}
            {craftedMaterialList.map((name, i) => (
              <Tr key={i} h="12" bgColor="blackAlpha.600">
                <Td>{name}</Td>
                <Td>{craftedMaterials[i] || 0}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Flex>
  );
};

export default Index;
