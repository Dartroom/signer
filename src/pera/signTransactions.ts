import { Provider } from '../main'
import { Txn } from '../signTransactions'
import { decodeUnsignedTransaction, Transaction } from 'algosdk'

export default async function sign ({ pera }: Provider, txns: Array<Array<Txn>>): Promise<Array<Txn>> {

  const unsignedTxns: Array<Txn> = []
  let formatedTxns: Array<Array<{ txn: Transaction, signers?: Array<string> }>> = []

  for (let g = 0; g < txns.length; g++) {
    for (let t = 0; t < txns[g].length; t++) {
      unsignedTxns.push(txns[g][t])
    }
  }

  formatedTxns = txns.map((txnGroup) => {
    return txnGroup.map((txn) => {
      return {
        txn: decodeUnsignedTransaction(txn.blob),
        signers: txn.signers
      }
    })
  })

  let signedTxns: Array<Uint8Array> = []

  await pera.reconnectSession()
  signedTxns = await pera.signTransaction(formatedTxns)

  if (signedTxns.length > 0) {
    return signedTxns.map((txn, i) => {
      return {
        blob: txn,
        txID: unsignedTxns[i].txID,
        signers: unsignedTxns[i].signers
      }
    })
  } else {
    throw new Error('')
  }
}