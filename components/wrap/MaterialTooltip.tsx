import { FC } from "react";
import { Center, Tooltip as ChakraTooltip, TooltipProps } from "@chakra-ui/react";
import Image from "next/image";

const MaterialToolTip: FC<{ image: StaticImageData } & TooltipProps> = (props) => (
  <ChakraTooltip
    bgColor="whiteAlpha.800"
    placement="top-start"
    label={
      <Center pt="4">
        <Image width="152px" height="80px" src={props.image} />
      </Center>
    }
    {...props}
  >
    {props.children}
  </ChakraTooltip>
);

export default MaterialToolTip;
