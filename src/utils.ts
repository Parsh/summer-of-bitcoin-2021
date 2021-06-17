
import array_sort from 'array-sort'
import { MempoolTransactions, txid, WeightedMempoolTransaction, WeightedMempoolTransactions } from "./interface";

const calculateParentAccumulatives = (txs: MempoolTransactions, parents: txid[],): {accumulativeWeight: number, accumulativeWeightedFee: number, parentHierarchy: txid[]} => {
    let accumulativeWeight = 0
    let accumulativeWeightedFee = 0
    const parentHierarchy: txid[] = []
    parents.forEach((parent_txid) => {
          const parentTx = txs[parent_txid]
          let parentAccumulatives = calculateParentAccumulatives(txs, parentTx.parents)

          const weightedFee = parentTx.fee/parentTx.weight
          accumulativeWeight += parentAccumulatives.accumulativeWeight + parentTx.weight
          accumulativeWeightedFee += (parentAccumulatives.accumulativeWeightedFee + weightedFee)
          parentHierarchy.push(...parentAccumulatives.parentHierarchy, parentTx.tx_id)
    })
    return {accumulativeWeight, accumulativeWeightedFee, parentHierarchy}
}

export const sortTransactionsByWeightedFee = (txs: MempoolTransactions): WeightedMempoolTransaction[] => {
    const weightedTxs: WeightedMempoolTransactions = {}
    Object.values(txs).forEach(tx => {
      const parentAccumulatives = calculateParentAccumulatives(txs, tx.parents)
      const weightedFee = tx.fee / tx.weight;
      const accumulativeWeight = parentAccumulatives.accumulativeWeight + tx.weight
      const accumulativeWeightedFee = parentAccumulatives.accumulativeWeightedFee + weightedFee
      const weightedTx: WeightedMempoolTransaction = {
            ...tx,
            accumulativeWeight,
            accumulativeWeightedFee,
            parentHierarchy: parentAccumulatives.parentHierarchy
      }
      weightedTxs[tx.tx_id] = weightedTx
    });

    const weightedTxsArray = Object.values(weightedTxs);
    array_sort(weightedTxsArray, "accumulativeWeightedFee");
    return weightedTxsArray.reverse();
  };

