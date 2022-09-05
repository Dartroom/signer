import { Provider } from '../main'
import { Txn } from '../signTransactions'

export default async function sign ({ algoSigner }: Provider, txns: Array<Array<Txn>>) {

  if (!algoSigner) {
    throw new Error('Failed to connect with the AlgoSigner. Make sure the browser extension is installed.')
  }

  const binaryTxns: Array<{ txn: string, signers?: Array<string> }> = []

  for (let g = 0; g < txns.length; g++) {
    for (let t = 0; t < txns[g].length; t++) {
      if (txns[g][t].signers.length > 1) {
        return {
          txn: algoSigner.encoding.msgpackToBase64(txns[g][t].txn.toByte()),
          signers: txns[g][t].signers
        }
      } else {
        return {
          txn: algoSigner.encoding.msgpackToBase64(txns[g][t].txn.toByte())
        }
      }
    }
  }

  const signedTxns = await algoSigner.signTxn(binaryTxns)

  return signedTxns
}