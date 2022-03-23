import type { AppProps } from "next/app";
import { StarknetProvider } from "@starknet-react/core";
import { ChakraProvider } from "@chakra-ui/react";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <StarknetProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </StarknetProvider>
  );
};

export default App;
