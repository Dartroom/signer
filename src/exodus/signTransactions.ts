import { Provider } from '../main'
import { Txn } from '../signTransactions'
import { decodeUnsignedTransaction } from 'algosdk'

export default async function sign ({ exodus }: Provider, txns: Array<Array<Txn>>): Promise<Array<Txn>> {

  const binaryTxns: Array<Uint8Array> = []
  const unsignedTxns: Array<Txn> = []

  for (let g = 0; g < txns.length; g++) {
    for (let t = 0; t < txns[g].length; t++) {
      binaryTxns.push(decodeUnsignedTransaction(txns[g][t].blob).toByte())
      unsignedTxns.push(txns[g][t])
    }
  }

  const signedTxns = await exodus.signTransaction(binaryTxns) as Array<Uint8Array>

  return signedTxns.map((blob, i) => {
    return {
      blob: blob,
      signers: unsignedTxns[i].signers,
      txID: unsignedTxns[i].txID
    }
  })
}