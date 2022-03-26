import { Box, Center, Flex, HStack, Spacer } from "@chakra-ui/react";
import Image from "next/image";
import { VFC } from "react";
import { Text } from "~/components/common";
import { PhiBoy } from "~/public";

const PhiCard: VFC = () => {
  return (
    <Flex w="64" h="12" bgColor="gray.800" border="1px solid" borderColor="gray.600" borderRadius="md" justify="center">
      <Center>
        <Image width="32px" height="32px" src={PhiBoy} />
        <Text fontSize="2xl">Φ Philand</Text>
      </Center>
    </Flex>
  );
};

export default PhiCard;
