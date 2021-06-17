import csv from "csv-parser"
import fs from "fs"
import { MempoolTransaction } from "./interface";

const processRawMempoolTransaction = (rawTx: any): MempoolTransaction => {
    // transforms rawTx from mempool.csv to operational tx

    // splitting parent txs; forming parents array    
    const splits = rawTx.parents.split(";");
    rawTx.parents = splits[0] ? splits : [];

    // type casting(string >> int)
    rawTx.fee = parseInt(rawTx.fee)
    rawTx.weight = parseInt(rawTx.weight)

    return rawTx
}

export const fetchMempool = async (callback: Function) => {
  // reads and parses mempool.csv    

  let mempool: MempoolTransaction[] = [];
  await fs
        .createReadStream(__dirname + "/files/mempool.csv")
        .pipe(csv())
        .on("data", data => mempool.push(processRawMempoolTransaction(data)))
        .on("end", () => {
              console.log(`Mempool stats: ${mempool.length} transactions in the pool`)
              callback(mempool)
        });
};
