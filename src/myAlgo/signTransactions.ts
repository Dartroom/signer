import { Provider } from '../main'
import { Txn } from '../signTransactions'
import MyAlgoConnect, { WalletTransaction } from '@randlabs/myalgo-connect'
import { decodeUnsignedTransaction } from 'algosdk'

export default async function sign ({ }: Provider, txns: Array<Array<Txn>>): Promise<Array<Txn>> {
  const myAlgo = new MyAlgoConnect()

  const binaryTxns: Array<Uint8Array> = []
  const unsignedTxns: Array<Txn> = []

  for (let g = 0; g < txns.length; g++) {
    for (let t = 0; t < txns[g].length; t++) {
      binaryTxns.push(decodeUnsignedTransaction(txns[g][t].blob).toByte())
      unsignedTxns.push(txns[g][t])
    }
  }

  const signedTxns = await myAlgo.signTransaction(binaryTxns)

  if (signedTxns.length > 0) {
    return signedTxns.map((txn, i) => {
      return {
        blob: new Uint8Array(Buffer.from(txn.blob.buffer)),
        txID: unsignedTxns[i].txID,
        signers: unsignedTxns[i].signers
      }
    })
  } else {
    throw new Error('')
  }
}