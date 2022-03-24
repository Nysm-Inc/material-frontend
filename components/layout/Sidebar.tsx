import { useRouter } from "next/router";
import { FC, useContext } from "react";
import { Box, VStack } from "@chakra-ui/react";
import { useContract, useStarknetCall, useStarknetInvoke } from "@starknet-react/core";
import { dailyBonusAbi } from "~/abi";
import { Abi } from "starknet";
import { DailyBonusContractAddress } from "~/constants";
import { feltToNum, numToFelt } from "~/utils/cairo";
import { AppContext } from "~/contexts";
import { Button } from "~/components/common";

const Index: FC = () => {
  const { account } = useContext(AppContext);
  const router = useRouter();

  const { contract: dailyBonusContract } = useContract({
    abi: dailyBonusAbi as Abi,
    address: DailyBonusContractAddress,
  });

  const { data: isMintableReward } = useStarknetCall({
    contract: dailyBonusContract,
    method: "check_reward",
    args: [numToFelt(account)],
  });
  const { invoke: getReward } = useStarknetInvoke({
    contract: dailyBonusContract,
    method: "get_reward",
  });

  return (
    <VStack w="40" h="100%">
      <Button
        w="24"
        bgColor="primary.100"
        disabled={!feltToNum(isMintableReward)}
        onClick={() => {
          if (!account) return;
          getReward({ args: [numToFelt(account)] });
        }}
      >
        Daily Mint
      </Button>
      <Button w="24" onClick={() => router.push("/craft")}>
        Craft
      </Button>
      <Button w="24" onClick={() => router.push("/wrap")}>
        Wrap
      </Button>
      <Button w="24" onClick={() => router.push("/analytics")}>
        Analytics
      </Button>
      <Button w="24" onClick={() => router.push("/voyager")}>
        Voyager
      </Button>
    </VStack>
  );
};

export default Index;
