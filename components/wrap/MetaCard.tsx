import { Box, Center, Flex, HStack } from "@chakra-ui/react";
import Image from "next/image";
import { VFC } from "react";
import { Text } from "~/components/common";
import { Meta } from "~/public";

const MetaCard: VFC = () => {
  return (
    <Flex w="64" h="12" bgColor="gray.800" border="1px solid" borderColor="gray.600" borderRadius="md" justify="center">
      <Center>
        <Image width="40px" height="40px" src={Meta} />
        <Text fontSize="2xl">Meta | Materials</Text>
      </Center>
    </Flex>
  );
};

export default MetaCard;
