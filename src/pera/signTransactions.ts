import { Provider } from '../main'
import { Txn, TxnArray } from '../signTransactions'
import { decodeUnsignedTransaction, Transaction } from 'algosdk'

export default async function sign<T extends Txn>({ pera }: Provider, txns: Array<Array<T>>): Promise<Array<Array<T>>> {

  const unsignedTxns: Array<T> = []
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
  let formated: Array<Array<T>> = []

  await pera.reconnectSession()
  signedTxns = await pera.signTransaction(formatedTxns)

  if (signedTxns && signedTxns.length > 0) {
    formated = txns.map((txnArray, i) => {
      const unsignedArray = txns[i]
      const signedArray = signedTxns.splice(0, txnArray.length)

      if (!unsignedArray) {
        throw new Error('Failed to parse transaction array.')
      }

      return signedArray.map((signedTxn, index) => {
        const usignedTxn = unsignedArray[index]

        if (!usignedTxn) {
          throw new Error('Failed to parse transaction array.')
        }

        return {
          ...usignedTxn,
          blob: signedTxn
        }
      })
    })

  } else {
    throw new Error('The Pera wallet did not return any transactions.')
  }

  return formated
}