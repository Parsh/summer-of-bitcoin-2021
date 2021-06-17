type txid = string

export interface MempoolTransaction {
    tx_id: txid,
    fee: number,
    weight: number,
    parents: txid[]
}