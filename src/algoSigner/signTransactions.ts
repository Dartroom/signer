import { Provider } from '../main'
import { Txn } from '../signTransactions'

interface AlgoSignerTxn {
  txn: string,
  signers?: Array<string>
  authAddr?: string
}

export default async function sign<T extends Txn>({ algoSigner }: Provider, txns: Array<Array<T>>): Promise<Array<Array<T>>> {

  if (!algoSigner?.algorand) {
    throw new Error('Failed to connect with the AlgoSigner. Make sure the browser extension is installed.')
  }

  const unsignedTxns: Array<T> = []
  let formatedTxns: Array<Array<{ txn: string, signers?: Array<string> }>> = []

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
      const format = {
        txn: algoSigner.algorand.encoding.msgpackToBase64(txn.blob),
      } as AlgoSignerTxn

      if (txn.authAddress) {
        format['authAddr'] = txn.authAddress
      } else if (txn.signers) {
        format['signers'] = txn.signers
      }

      return format
    })
  })

  let formated: Array<Array<T>> = []

  const signedTxns = await algoSigner.algorand.signTxns(formatedTxns) as unknown as Array<string>

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
          blob: Uint8Array.from(algoSigner.algorand.encoding.base64ToMsgpack(signedTxn))
        }
      })
    })
  } else {
    throw new Error('')
  }

  return formated
}