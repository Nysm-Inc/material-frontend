import { FC, useContext, useEffect, useState } from "react";
import { HStack, VStack } from "@chakra-ui/react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { AppContext } from "~/contexts";
import { useContract, useStarknetCall } from "@starknet-react/core";
import { Abi } from "starknet";
import { erc20Abi } from "~/abi";
import { ERC20ContractAddress } from "~/constants";
import { feltToNum, numToFelt } from "~/utils/cairo";

const Index: FC = ({ children }) => {
  const { account } = useContext(AppContext);
  const { contract: erc20Contract } = useContract({
    abi: erc20Abi as Abi,
    address: ERC20ContractAddress,
  });
  const { data } = useStarknetCall({
    contract: erc20Contract,
    method: "balanceOf",
    args: account ? [numToFelt(account)] : [],
  });
  // @ts-ignore
  const balance = feltToNum(data?.balance?.low);

  return (
    <VStack w="100vw" h="100vh" bgColor="black">
      <Header nonBalance={balance <= 0} />

      <HStack w="100%" h="100%">
        <Sidebar nonBalance={balance <= 0} />
        {children}
      </HStack>
    </VStack>
  );
};

export default Index;
