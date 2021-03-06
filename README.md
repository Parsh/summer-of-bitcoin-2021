# Summer of Bitcoin Coding Challenge

## The problem

Bitcoin miners construct blocks by selecting a set of transactions from their
mempool. Each transaction in the mempool:

- includes a _fee_ which is collected by the miner if that transaction is
  included in a block
- has a _weight_, which indicates the size of the transaction
- may have one or more _parent transactions_ which are also in the mempool

The miner selects an ordered list of transactions which have a combined weight
below the maximum block weight. Transactions with parent transactions in the
mempool may be included in the list, but only if all of their parents appear
_before them_ in the list.

Naturally, the miner would like to include the transactions that maximize the
total fee.

Your task is to write a program which reads a file mempool.csv, with the
format:

`<txid>,<fee>,<weight>,<parent_txids>`

- `txid` is the transaction identifier
- `fee` is the transaction fee
- `weight` is the transaction weight
- `parent_txids` is a list of the txids of the transaction’s **unconfirmed**
  parent transactions (confirmed parent transactions are not included in this
  list).  It is of the form: `<txid1>;<txid2>;...`

The output from the program should be txids, separated by newlines, which
make a valid block, maximizing the fee to the miner. Transactions **MUST**
appear in order (no transaction should appear before one of its parents).

## Solution Overview

The src folder contains the modules that addresses the above challenge.

- `index.ts`: executes and orchestrates the solution modules 
- `src/mempool.ts`: reads transactions from mempool.csv and generates a block while optimising for fee
- `src/utils.ts`: contains utility functions consumed by mempool.ts
- `src/interface.ts`: has type definitions for data structures used

### Execution Instructions

#### Prerequisites:

- [Node.js](https://nodejs.org/en/)

#### How to execute

```sh
git clone https://github.com/Parsh/summer-of-bitcoin-2021.git
cd summer-of-bitcoin-2021
npm install
npm start
```