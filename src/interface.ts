export const BLOCK_WEIGHT_MAX = 4000000
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
    accumulativeWeight: number;       // (weight + parent's weight)
    accumulativeFee: number;          // (fee + parent's fee)
    accumulativeWeightedFee: number,  // (fee + parent's fee)/(weight + parent's weight)
    txHierarchy: txid[]               // hierarchy of parents and child transactions(top-down)
}

export interface WeightedMempoolTransactions {
    [tx_id: string]: WeightedMempoolTransaction
}  