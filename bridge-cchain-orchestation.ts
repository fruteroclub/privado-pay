import { erc20Abi, parseUnits } from "viem";
import { arbitrumSepolia, avalancheFuji } from "viem/chains";

import {
  createMeeClient,
  mcUSDC,
  mcARB,
  greaterThanOrEqualTo,
  runtimeERC20BalanceOf,
  type MultichainSmartAccount,
} from "@biconomy/abstractjs";
import { ChainLinkSenderAbi } from "./utils/chainlink-abi";
import { createMultichainSmartAccount } from "./utils/multichain-smart-account";

const chainLinkSenderContract = "0xBf81BA7B8fB1E1e06ceA839C2c7B8d3E8392ebE4";

export const bridgeToCChain = async () => {
  const smartAccount: MultichainSmartAccount =
    await createMultichainSmartAccount();

  // Check token balance across chains
  const balance = await smartAccount.getUnifiedERC20Balance(mcUSDC);
  console.log("USDC balance:", balance);

  const balanceARB = await smartAccount.getUnifiedERC20Balance(mcARB);
  console.log("ARB balance:", balanceARB);

  const usdcAmount = parseUnits("1", 6);
  const arbAmount = parseUnits("1.2", 18);

  // Verificar si tenemos suficiente balance

  const executionConstraints = [
    greaterThanOrEqualTo((arbAmount * BigInt(96)) / BigInt(100)),
  ];

  const approveSendToCChain = await smartAccount.buildComposable({
    type: "default",
    data: {
      to: mcUSDC.addressOn(arbitrumSepolia.id),
      abi: erc20Abi,
      functionName: "approve",
      args: [
        chainLinkSenderContract,
        runtimeERC20BalanceOf({
          targetAddress: smartAccount.addressOn(arbitrumSepolia.id, true),
          tokenAddress: mcUSDC.addressOn(arbitrumSepolia.id),
          constraints: executionConstraints,
        }),
      ],
      chainId: arbitrumSepolia.id,
    },
  });

  const sendToCChain = await smartAccount.buildComposable({
    type: "default",
    data: {
      to: chainLinkSenderContract,
      abi: ChainLinkSenderAbi,
      functionName: "sendMessagePayLINK",
      args: [
        "14767482510784806043",
        "order_10101",
        usdcAmount,
      ],
      chainId: arbitrumSepolia.id,
    },
  });

  const meeClient = await createMeeClient({
    account: smartAccount,
    apiKey: process.env.BICONOMY_API_KEY,
  });

  const { hash } = await meeClient.executeQuote({
    quote: await meeClient.getQuote({
      instructions: [approveSendToCChain, sendToCChain],
      feeToken: {
        address: mcUSDC.addressOn(arbitrumSepolia.id),
        chainId: arbitrumSepolia.id,
      },
    }),
  });

  console.log(`Started execution: ${hash}`);

  // Wait for the transaction to complete
  const receipt = await meeClient.waitForSupertransactionReceipt({ hash });
  console.log(`Successful execution: ${receipt.hash}`);

  return receipt;
};
