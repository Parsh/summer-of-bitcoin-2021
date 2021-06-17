import csv from "csv-parser"
import fs from "fs"
import { MempoolTransaction, MempoolTransactions } from "./interface";

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
