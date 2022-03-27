import Image from "next/image";
import Link from "next/link";
import { FC, useContext, useEffect, useState } from "react";
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
import { fetchBalanceOfErc20 } from "~/utils/material";

const Index: FC = () => {
  const { account } = useContext(AppContext);
  const [balance, setBalance] = useState<number | null>(null);
  const { contract } = useContract({
    abi: erc20Abi as Abi,
    address: ERC20ContractAddress,
  });
  const { invoke: mint } = useStarknetInvoke({
    contract: contract,
    method: "mint",
  });

  useEffect(() => {
    if (!account) return;

    (async () => {
      const _balance = await fetchBalanceOfErc20(account);
      setBalance(_balance);
    })();
  }, [account]);

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

      {balance !== null && balance <= 0 ? (
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
