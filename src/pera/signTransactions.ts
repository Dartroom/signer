import { Provider } from '../main'
import { Txn } from '../signTransactions'
import { decodeUnsignedTransaction, Transaction } from 'algosdk'

export default async function sign ({ pera }: Provider, txns: Array<Array<Txn>>): Promise<Array<Txn>> {

  const unsignedTxns: Array<Txn> = []
  let formatedTxns: Array<Array<{ txn: Transaction, signers?: Array<string> }>> = []

  for (let g = 0; g < txns.length; g++) {

    const txnArray = txns[g]

    if (!txnArray) {
      throw new Error('Failed to parse transaction array.')
    }

    for (let t = 0; t < txnArray.length; t++) {

      const txn = txnArray[t]

      if (!txn) {
        throw new Error('Failed to parse transaction array.')
      }

      unsignedTxns.push(txn)
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

      const unsignedTxn = unsignedTxns[i]

      if (!unsignedTxn) {
        throw new Error('Failed to parse transaction array.')
      }

      return {
        blob: txn,
        txID: unsignedTxn.txID,
        signers: unsignedTxn.signers
      }
    })
  } else {
    throw new Error('')
  }
}