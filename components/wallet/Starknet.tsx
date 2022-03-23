import Image from "next/image";
import { useEffect } from "react";
import { useStarknet, InjectedConnector } from "@starknet-react/core";
import { Button, Text } from "@chakra-ui/react";
import { Argent } from "~/public";

const WalletStarknet = () => {
  const { account, connect } = useStarknet();

  useEffect(() => {
    if (!account) connect(new InjectedConnector());
  }, [account]);

  return (
    <>
      {!account ? (
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Image src={Argent} width="16px" height="16px" />}
          onClick={() => connect(new InjectedConnector())}
        >
          <Text fontSize="sm" fontWeight="bold">
            Connect Wallet
          </Text>
        </Button>
      ) : (
        <Button size="sm" leftIcon={<Image src={Argent} width="16px" height="16px" />}>
          <Text fontSize="sm" fontWeight="bold">
            {account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : "No Account"}
          </Text>
        </Button>
      )}
    </>
  );
};

export default WalletStarknet;
