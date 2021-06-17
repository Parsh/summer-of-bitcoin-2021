
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

export const sortTransactionsByWeightedFee = (txs: MempoolTransactions): WeightedMempoolTransaction[] => {
    const weightedTxs: WeightedMempoolTransactions = {}
    Object.values(txs).forEach(tx => {
      const parentAccumulatives = calculateParentAccumulatives(txs, tx.parents)
     
      const accumulativeWeight = parentAccumulatives.accumulativeWeight + tx.weight
      const accumulativeFee = parentAccumulatives.accumulativeFee + tx.fee
      const accumulativeWeightedFee = accumulativeFee / accumulativeWeight
      const parentHierarchy = [...parentAccumulatives.parentHierarchy, tx.tx_id]

      const weightedTx: WeightedMempoolTransaction = {
            ...tx,
            accumulativeWeight,
            accumulativeFee,
            accumulativeWeightedFee,
            parentHierarchy,
      }
      weightedTxs[tx.tx_id] = weightedTx
    });

    const weightedTxsArray = Object.values(weightedTxs);
    array_sort(weightedTxsArray, "accumulativeWeightedFee");
    return weightedTxsArray.reverse();
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
    