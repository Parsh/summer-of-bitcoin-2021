import csv from "csv-parser"
import fs from "fs"
import { BLOCK_WEIGHT_MAX, MempoolTransaction, MempoolTransactions, txid, WeightedMempoolTransaction, WeightedMempoolTransactions } from "./interface";

const processRawMempoolTransaction = (rawTx: any): MempoolTransaction => {
    // transforms rawTx from mempool.csv to operational tx

    // splitting parent txs; forming parents array    
    const splits = rawTx.parents.split(";");
    rawTx.parents = splits[0] ? splits : [];

    // type casting(string >> int)
    rawTx.fee = parseInt(rawTx.fee, 10)
    rawTx.weight = parseInt(rawTx.weight, 10)

    return rawTx
}

export const fetchMempool = async (callback: Function) => {
  // reads and parses mempool.csv    

  const mempool: MempoolTransactions = {};
  await fs
        .createReadStream(__dirname + "/files/mempool.csv")
        .pipe(csv())
        .on("data", data => mempool[data.tx_id] = processRawMempoolTransaction(data))
        .on("end", () => {
              callback(mempool)
        });
};

export const generateBlockFromMempool = (weightedTxs: WeightedMempoolTransactions, sortedWeightedTxsList: WeightedMempoolTransaction[]) => {
      let block: txid[] = [];
      let accumulativeWeight = 0;
      let accumulativeFee = 0;

      for(const tx of sortedWeightedTxsList){
            if(block.includes(tx.tx_id)) continue

            for(const txid of tx.txHierarchy){
                  if(!block.includes(txid)){
                        const hierarchicalTx = weightedTxs[txid]
                        if(accumulativeWeight + hierarchicalTx.weight > BLOCK_WEIGHT_MAX) break;    
                        
                        accumulativeWeight += hierarchicalTx.weight
                        accumulativeFee += hierarchicalTx.fee
                        block.push(hierarchicalTx.tx_id)
                  } 
            }
      }

      console.log(`Block stats - Transactions: ${ block.length }, Weight: ${ accumulativeWeight }, Fee: ${ accumulativeFee }`)
      return block;
}
