import { MempoolTransactions, WeightedMempoolTransaction } from "./src/interface";
import { generateBlockFromMempool, fetchMempool } from "./src/mempool";
import { saveBlock, sortTransactionsByWeightedFee } from "./src/utils";

const execute = (mempool: MempoolTransactions) => {
    const { weightedTxs, sortedWeightedTxsList } = sortTransactionsByWeightedFee(mempool);
    const block = generateBlockFromMempool(weightedTxs, sortedWeightedTxsList);
    saveBlock(block);
  };

fetchMempool(execute)