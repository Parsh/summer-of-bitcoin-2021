import { MempoolTransactions, WeightedMempoolTransaction } from "./src/interface";
import { generateBlock, fetchMempool } from "./src/mempool";
import { saveBlock, sortTransactionsByWeightedFee } from "./src/utils";

const execute = (mempool: MempoolTransactions) => {
    let weightedMempoolTransactions: WeightedMempoolTransaction[] = sortTransactionsByWeightedFee(mempool);
    const block = generateBlock(weightedMempoolTransactions);
    saveBlock(block);
  };

fetchMempool(execute)