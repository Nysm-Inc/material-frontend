import Image from "next/image";
import { FC } from "react";
import { Box, Center, Flex, HStack } from "@chakra-ui/react";
import WalletStarknet from "~/components/wallet/Starknet";
import { Text } from "~/components/common";
import { Meta, MetaBlack } from "~/public";
import Link from "next/link";

const Index: FC = () => {
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
      <WalletStarknet />
    </Flex>
  );
};

export default Index;
