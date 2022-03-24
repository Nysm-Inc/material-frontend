import type { NextPage } from "next";
import { Link, VStack } from "@chakra-ui/react";
import {
  CraftContractAddress,
  CraftMaterialContractAddress,
  DailyBonusContractAddress,
  DailyMaterialContractAddress,
  ERC20ContractAddress,
  WrapContractAddress,
  WrapCraftMaterialContractAddress,
  WrapMaterialContractAddress,
} from "~/constants";
import { useContext } from "react";
import { AppContext } from "~/contexts";
import { numToFelt } from "~/utils/cairo";
import { Text } from "~/components/common";

const Index: NextPage = () => {
  const { account } = useContext(AppContext);
  return (
    <VStack w="100%" h="100%">
      <Text fontSize="3xl">Voyager</Text>
      <Text>owner: {numToFelt(account)}</Text>
      <Link
        href={`https://goerli.voyager.online/contract/${ERC20ContractAddress}`}
        isExternal
        textDecoration="underline"
        textDecorationColor="white"
      >
        <Text>ERC20</Text>
      </Link>
      <Link
        href={`https://goerli.voyager.online/contract/${DailyBonusContractAddress}`}
        isExternal
        textDecoration="underline"
        textDecorationColor="white"
      >
        <Text>Daily Bonus</Text>
      </Link>
      <Link
        href={`https://goerli.voyager.online/contract/${DailyMaterialContractAddress}`}
        isExternal
        textDecoration="underline"
        textDecorationColor="white"
      >
        <Text>Daily Material</Text>
      </Link>
      <Link
        href={`https://goerli.voyager.online/contract/${CraftMaterialContractAddress}`}
        isExternal
        textDecoration="underline"
        textDecorationColor="white"
      >
        <Text>Craft Material</Text>
      </Link>
      <Link
        href={`https://goerli.voyager.online/contract/${CraftContractAddress}`}
        isExternal
        textDecoration="underline"
        textDecorationColor="white"
      >
        <Text>Craft</Text>
      </Link>
      <Link
        href={`https://goerli.voyager.online/contract/${WrapContractAddress}`}
        isExternal
        textDecoration="underline"
        textDecorationColor="white"
      >
        <Text>Wrap</Text>
      </Link>
      <Link
        href={`https://goerli.voyager.online/contract/${WrapMaterialContractAddress}`}
        isExternal
        textDecoration="underline"
        textDecorationColor="white"
      >
        <Text>Wrap Material</Text>
      </Link>
      <Link
        href={`https://goerli.voyager.online/contract/${WrapCraftMaterialContractAddress}`}
        isExternal
        textDecoration="underline"
        textDecorationColor="white"
      >
        <Text>Wrap Craft Material</Text>
      </Link>
    </VStack>
  );
};

export default Index;
