import type { AppProps } from "next/app";
import { StarknetProvider } from "@starknet-react/core";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "~/components/layout/Layout";
import AppContextProvider from "~/contexts";
import theme from "~/styles";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <StarknetProvider>
      <ChakraProvider theme={theme}>
        <AppContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AppContextProvider>
      </ChakraProvider>
    </StarknetProvider>
  );
};

export default App;
