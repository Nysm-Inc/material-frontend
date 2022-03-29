import { FC, useContext, useEffect, useState } from "react";
import { HStack, VStack } from "@chakra-ui/react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { AppContext } from "~/contexts";
import { fetchBalanceOfErc20 } from "~/utils/material";

const Index: FC = ({ children }) => {
  const { account } = useContext(AppContext);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!account) return;

    (async () => {
      const _balance = await fetchBalanceOfErc20(account);
      setBalance(_balance);
    })();
  }, [account]);

  return (
    <VStack w="100vw" h="100vh" bgColor="black">
      <Header nonBalance={balance !== null && balance <= 0} />

      <HStack w="100%" h="100%">
        <Sidebar nonBalance={balance !== null && balance <= 0} />
        {children}
      </HStack>
    </VStack>
  );
};

export default Index;
