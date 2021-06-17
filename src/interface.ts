export type txid = string

export interface MempoolTransaction {
    tx_id: txid,
    fee: number,
    weight: number,
    parents: txid[]
}

export interface MempoolTransactions {
    [tx_id: string]: MempoolTransaction
}

export interface WeightedMempoolTransaction extends MempoolTransaction {
    accumulativeWeightedFee: number,  // (fee + parent's fee)/(weight + parent's weight)
}

export interface WeightedMempoolTransactions {
    [tx_id: string]: WeightedMempoolTransaction
}
