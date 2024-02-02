import { Provider } from '../main'
import { Txn, TxnArray } from '../signTransactions'
import { decodeUnsignedTransaction, Transaction } from 'algosdk'

export default async function sign<T extends Txn>({ defly }: Provider, txns: Array<Array<T>>): Promise<Array<Array<T>>> {

  const unsignedTxns: Array<T> = []
  let logicTxns: Array<Array<boolean>> = []
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

  logicTxns = txns.map((txnGroup) => {
    return txnGroup.map((txn) => txn.signers.length === 0)
  })

  let signedTxns: Array<Uint8Array> = []
  let formated: Array<Array<T>> = []

  await defly.reconnectSession()
  signedTxns = await defly.signTransaction(formatedTxns)

  if (signedTxns && signedTxns.length > 0) {
    formated = txns.map((txnArray, i) => {
      const unsignedArray = txns[i]
      const logicsigs = logicTxns[i]

      if (!logicsigs) {
        throw new Error('Failed to check for logic sigs.')
      }

      const signedArray = logicsigs.map((logic) => {
        if (logic) {
          return null
        } else {
          return signedTxns.splice(0, 1)[0]
        }
      })

      if (!unsignedArray) {
        throw new Error('Failed to parse transaction array.')
      }

      return signedArray.map((signedTxn, index) => {
        const usignedTxn = unsignedArray[index]

        if (!usignedTxn) {
          throw new Error('Failed to parse transaction array.')
        }

        if (!signedTxn) {
          return usignedTxn
        }

        return {
          ...usignedTxn,
          blob: signedTxn
        }
      })
    })

  } else {
    throw new Error('The Defly wallet did not return any transactions.')
  }

  return formated
}