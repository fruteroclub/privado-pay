import { swapOrchestation } from "./swap-orchestation";
import { bridgeToCChain } from "./bridge-cchain-orchestation";
  
  const main = async () => {
    try {
        const receipt = await swapOrchestation();
        console.log("Swap Receipt:", receipt);

        if (receipt.transactionStatus === "MINED_SUCCESS") {
            const bridgeReceipt = await bridgeToCChain();
            console.log("Bridge Receipt:", bridgeReceipt);
        } 
    } catch (error) {
        console.error(error);
    }
    console.log("Done");
  };
  
  main()
  