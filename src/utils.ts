
import array_sort from 'array-sort'
import fs from "fs"
import { MempoolTransactions, txid, WeightedMempoolTransaction, WeightedMempoolTransactions } from "./interface";

const calculateParentAccumulatives = (txs: MempoolTransactions, parents: txid[]): {accumulativeWeight: number, accumulativeFee: number, parentHierarchy: txid[]} => {
    let accumulativeWeight = 0
    let accumulativeFee = 0
    const parentHierarchy: txid[] = []
    parents.forEach((parent_txid) => {
          const parentTx = txs[parent_txid]
          let parentAccumulatives = calculateParentAccumulatives(txs, parentTx.parents)

          accumulativeWeight += parentAccumulatives.accumulativeWeight + parentTx.weight
          accumulativeFee += (parentAccumulatives.accumulativeFee + parentTx.fee)
          parentHierarchy.push(...parentAccumulatives.parentHierarchy, parentTx.tx_id)
    })
    return { accumulativeWeight, accumulativeFee, parentHierarchy }
}

export const sortTransactionsByWeightedFee = (txs: MempoolTransactions): { weightedTxs: WeightedMempoolTransactions, sortedWeightedTxsList: WeightedMempoolTransaction[]} => {
    const weightedTxs: WeightedMempoolTransactions = {}
    Object.values(txs).forEach(tx => {
      const parentAccumulatives = calculateParentAccumulatives(txs, tx.parents)
     
      const accumulativeWeight = parentAccumulatives.accumulativeWeight + tx.weight
      const accumulativeFee = parentAccumulatives.accumulativeFee + tx.fee
      const accumulativeWeightedFee = accumulativeFee / accumulativeWeight
      const txHierarchy = [...parentAccumulatives.parentHierarchy, tx.tx_id]

      const weightedTx: WeightedMempoolTransaction = {
            ...tx,
            accumulativeWeight,
            accumulativeFee,
            accumulativeWeightedFee,
            txHierarchy,
      }
      weightedTxs[tx.tx_id] = weightedTx
    });

    const weightedTxsList = Object.values(weightedTxs);
    array_sort(weightedTxsList, "accumulativeWeightedFee");
    return {weightedTxs, sortedWeightedTxsList: weightedTxsList.reverse() };
  };

 export const saveBlock = (block: txid[]) => {
      const file = fs.createWriteStream(__dirname + "/files/block.txt");
      file.on("error", function(err) {
            console.log({err})
      });
      block.forEach(txid => {
        file.write(txid + "\n");
      });
      file.end();
};
    