import { Provider } from '../main'
import { Txn } from '../signTransactions'

export default async function sign ({ myAlgo }: Provider, txns: Array<Array<Txn>>) {

  const binaryTxns: Array<Uint8Array> = []

  for (let g = 0; g < txns.length; g++) {
    for (let t = 0; t < txns[g].length; t++) {
      binaryTxns.push(txns[g][t].txn.toByte())
    }
  }

  const signedTxns = await myAlgo.signTransaction(binaryTxns)

  return signedTxns
}