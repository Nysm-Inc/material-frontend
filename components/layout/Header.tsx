import Image from "next/image";
import Link from "next/link";
import { FC, useContext } from "react";
import { Abi } from "starknet";
import { useContract, useStarknetInvoke } from "@starknet-react/core";
import { Box, Center, Flex, HStack } from "@chakra-ui/react";
import WalletStarknet from "~/components/wallet/Starknet";
import { Button, Text } from "~/components/common";
import { Meta } from "~/public";
import { erc20Abi } from "~/abi";
import { ERC20ContractAddress } from "~/constants";
import { numToFelt } from "~/utils/cairo";
import { AppContext } from "~/contexts";

const Index: FC<{ nonBalance: boolean }> = ({ nonBalance }) => {
  const { account } = useContext(AppContext);
  const { contract } = useContract({
    abi: erc20Abi as Abi,
    address: ERC20ContractAddress,
  });
  const { invoke: mint } = useStarknetInvoke({
    contract: contract,
    method: "mint",
  });

  return (
    <Flex w="100%" h="20" justify="space-between" align="center" pl="6" pr="6">
      <Link href="/" passHref>
        <Box cursor="pointer">
          <HStack>
            <Center>
              <Image width="40px" height="40px" src={Meta} />
            </Center>
            <Text fontSize="2xl">Meta | Materials</Text>
          </HStack>
        </Box>
      </Link>

      {nonBalance ? (
        <Button
          bgColor="primary.100"
          onClick={() => {
            if (!account) return;
            mint({ args: [numToFelt(account), [numToFelt(500), numToFelt(0)]] });
          }}
        >
          Claim Test Token
        </Button>
      ) : (
        <></>
      )}
      <WalletStarknet />
    </Flex>
  );
};

export default Index;
