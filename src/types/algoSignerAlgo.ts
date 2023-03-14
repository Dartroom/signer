export default class Wrapper {
  private static instance: Wrapper;
  private task: Task = new Task();
  private router: Router = new Router();

  public encoding = {
    msgpackToBase64: byteArrayToBase64,
    base64ToMsgpack: base64ToByteArray,
    stringToByteArray,
    byteArrayToString,
  };

  public enable: Function = this.task.enable;
  public signAndPostTxns: Function = this.task.signAndPostTxns;
  // public getAlgodv2Client: Function = this.task.algod;
  // public getIndexerClient: Function = this.task.indexer;
  public signTxns: Function = this.task.signTxns;
  public postTxns: Function = this.task.postTxns;

  public static getInstance(): Wrapper {
    if (!Wrapper.instance) {
      Wrapper.instance = new Wrapper();
    }
    return Wrapper.instance;
  }
}

export declare type Field<T> = string | number;
export declare type TAccount = Field<string>;
export declare type Note = Field<string>;
export declare type Amount = Field<number>;
export declare type Transaction = {
    readonly amount: Amount;
    readonly from: TAccount;
    readonly note?: Note;
    readonly to: TAccount;
};
export declare enum Ledger {
    TestNet = "TestNet",
    MainNet = "MainNet"
}
export declare type WalletMultisigMetadata = {
    readonly version: number;
    readonly threshold: number;
    readonly addrs: Array<string>;
};
export declare type WalletTransaction = {
    readonly txn: string;
    readonly signers?: Array<string>;
    readonly message?: string;
    readonly msig?: WalletMultisigMetadata;
    readonly authAddr?: string;
};
export declare type Alias = {
    readonly name: string;
    readonly address: string;
    readonly namespace: Namespace;
    collides: boolean;
};
export declare enum Namespace {
    AlgoSigner_Contacts = "AlgoSigner_Contacts",
    AlgoSigner_Accounts = "AlgoSigner_Accounts",
    NFD = "NFD",
    ANS = "ANS"
}
export declare type NamespaceConfig = {
    name: string;
    namespace: Namespace;
    toggle: boolean;
};

export declare enum LogLevel {
  None = 0,
  Normal = 1,
  Debug = 2
}
declare class Logging {
  logThreshold: LogLevel;
  log(error: string, level?: LogLevel): void;
}
export declare var logging: Logging;

export declare class RequestError {
  static MAX_GROUP_SIZE: number;
  message: string;
  code: number;
  name: string;
  data?: any;
  static None: RequestError;
  static Undefined: RequestError;
  static UserRejected: RequestError;
  static NotAuthorizedByUser: RequestError;
  static NoAccountMatch: (address: string, ledger: string) => RequestError;
  static UnsupportedAlgod: RequestError;
  static UnsupportedLedger: RequestError;
  static NotAuthorizedOnChain: RequestError;
  static MultipleTxsRequireGroup: RequestError;
  static PendingTransaction: RequestError;
  static LedgerMultipleTransactions: RequestError;
  static TooManyTransactions: RequestError;
  static InvalidFields: (data?: any) => RequestError;
  static InvalidTransactionStructure: (data?: any) => RequestError;
  static InvalidFormat: RequestError;
  static InvalidSigners: RequestError;
  static InvalidStructure: RequestError;
  static InvalidMsigStructure: RequestError;
  static IncompleteOrDisorderedGroup: RequestError;
  static NonMatchingGroup: RequestError;
  static NoDifferentLedgers: RequestError;
  static SigningError: (code: number, data?: any) => RequestError;
  protected constructor(message: string, code: number, data?: any);
}

export declare function base64ToByteArray(blob: string): Uint8Array;
export declare function byteArrayToBase64(array: any): string;
export declare function stringToByteArray(str: string): Uint8Array;
export declare function byteArrayToString(array: any): string;

export declare class Validation implements IValidation {
  requiredArgs(required: Array<string>, input: Array<string>): boolean;
}

export declare class Runtime extends Validation {
}

export interface IValidation {
  requiredArgs(r: Array<string>, i: Array<string>): boolean;
}

export declare class Task extends Runtime implements ITask {
  static subscriptions: {
      [key: string]: Function;
  };
  connect(): Promise<JsonPayload>;
  accounts(params: JsonPayload, error?: RequestError): Promise<JsonPayload>;
  send(params: Transaction, error?: RequestError): Promise<JsonPayload>;
  algod(params: JsonPayload, error?: RequestError): Promise<JsonPayload>;
  indexer(params: JsonPayload, error?: RequestError): Promise<JsonPayload>;
  subscribe(eventName: string, callback: Function): void;
  /**
   * @param transactionsOrGroups array or nested array of grouped transaction objects
   * @returns array or nested array of signed transactions
   */
  signTxn(transactionsOrGroups: Array<WalletTransaction>, error?: RequestError): Promise<JsonPayload>;

  enable(opts: JsonPayload, error?: RequestError): Promise<JsonPayload>;
  signAndPostTxns(transactionsOrGroups: WalletTransaction[], opts?: SignTxnsOpts, error?: RequestError): Promise<JsonPayload>;
  signTxns(transactionsOrGroups: WalletTransaction[], opts?: SignTxnsOpts, error?: RequestError): Promise<JsonPayload>
  postTxns(stxns: string[] | string[][], error?: RequestError): Promise<JsonPayload>
}

export declare class Router {
  handler: Function;
  constructor();
  default(d: any): void;
  bounce(d: any): void;
}

export interface ITask {
  signTxn(transactionsOrGroups: Array<WalletTransaction>, error: RequestError): Promise<JsonPayload>;
}

export declare const JSONRPC_VERSION: string;
export declare enum JsonRpcMethod {
    Heartbeat = "heartbeat",
    Authorization = "authorization",
    AuthorizationAllow = "authorization-allow",
    AuthorizationDeny = "authorization-deny",
    SignAllow = "sign-allow",
    SignAllowWalletTx = "sign-allow-wallet-tx",
    SignDeny = "sign-deny",
    SignWalletTransaction = "sign-wallet-transaction",
    SendTransaction = "send-transaction",
    Algod = "algod",
    Indexer = "indexer",
    Accounts = "accounts",
    CreateWallet = "create-wallet",
    DeleteWallet = "delete-wallet",
    CreateAccount = "create-account",
    SaveAccount = "save-account",
    ImportAccount = "import-account",
    DeleteAccount = "delete-account",
    GetSession = "get-session",
    Login = "login",
    Logout = "logout",
    ClearCache = "clear-cache",
    AccountDetails = "account-details",
    Transactions = "transactions",
    AssetDetails = "asset-details",
    AssetsAPIList = "assets-api-list",
    AssetsVerifiedList = "assets-verified-list",
    SignSendTransaction = "sign-send-transaction",
    ChangeLedger = "change-ledger",
    SaveNetwork = "save-network",
    CheckNetwork = "check-network",
    DeleteNetwork = "delete-network",
    GetLedgers = "get-ledgers",
    GetContacts = "get-contacts",
    SaveContact = "save-contact",
    DeleteContact = "delete-contact",
    GetAliasedAddresses = "get-aliased-addresses",
    GetNamespaceConfigs = "get-namespace-configs",
    ToggleNamespaceConfig = "toggle-namespace-config",
    GetGovernanceAddresses = "get-governance-addresses",
    LedgerSaveAccount = "ledger-save-account",
    LedgerLinkAddress = "ledger-link-address",
    LedgerGetSessionTxn = "ledger-get-session-txn",
    LedgerSendTxnResponse = "ledger-send-txn-response",
    LedgerSignTransaction = "ledger-sign-transaction"
}
export declare type JsonPayload = {
    [key: string]: string | number | Array<WalletTransaction> | JsonPayload | undefined;
};
export declare type JsonRpcBody = {
    readonly jsonrpc: string;
    readonly method: JsonRpcMethod;
    readonly params: JsonPayload;
    readonly id: string;
};
export declare enum MessageSource {
    Extension = "extension",
    DApp = "dapp",
    Router = "router",
    UI = "ui"
}
export declare type MessageBody = {
    readonly source: MessageSource;
    readonly body: JsonRpcBody;
};
export declare type JsonRpcResponse = string;

export declare class JsonRpc {
  static getBody(method: JsonRpcMethod, params: JsonPayload): JsonRpcBody;
}

export type SignTxnsOpts = {
  [key: string]: string | boolean,
};

export enum OptsKeys {
  ARC01Return = 'AlgoSigner_arc01',
  sendTxns = 'AlgoSigner_send'
}

export type SafeAccount = {
  address: string;
  isRef: boolean;
  name: string;
  details?: any;
}

export type SensitiveAccount = SafeAccount & {
  mnemonic: string;
}

// { network: [...accounts] }
export type WalletStorage = { [key: string]: Array<SafeAccount> };

export type SessionObject = {
  wallet: WalletStorage;
  network: Network;
  availableNetworks: Array<NetworkTemplate>;
  txnRequest: any;
}

export enum Network {
  TestNet = 'TestNet',
  MainNet = 'MainNet',
}

export enum NetworkSelectionType {
  NoneProvided,
  OnlyIDProvided,
  BothProvided,
}

export type Connection = {
  headers: {},
  algod: ConnectionDetails,
  indexer: ConnectionDetails,
}

export type ConnectionDetails = {
  url: string,
  port: string,
  apiKey: {},
  headers: {},
}

export class NetworkTemplate {
  name: string;
  readonly isEditable: boolean;
  genesisID?: string;
  genesisHash?: string;
  symbol?: string;
  algodUrl?: string;
  indexerUrl?: string;
  headers?: string;

  constructor({
    name,
    genesisID,
    genesisHash,
    symbol,
    algodUrl,
    indexerUrl,
    headers,
  }: {
    name: string;
    genesisID?: string;
    genesisHash?: string;
    symbol?: string;
    algodUrl?: string;
    indexerUrl?: string;
    headers?: string;
  }) {
    if (!name) {
      throw Error('A name is required for ledgers.');
    }

    this.name = name;
    this.genesisID = genesisID;
    this.genesisHash = genesisHash;
    this.symbol = symbol;
    this.algodUrl = algodUrl;
    this.indexerUrl = indexerUrl;
    this.headers = headers;
    // We protect the default networks from being overriden
    this.isEditable = !Object.values(Network).includes(name as Network);
  }
}

export function getBaseSupportedNetworks(): Array<NetworkTemplate> {
  // Need to add access to additional network types from import
  return [
    new NetworkTemplate({
      name: Network.MainNet,
      genesisID: 'mainnet-v1.0',
      genesisHash: 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
    }),
    new NetworkTemplate({
      name: Network.TestNet,
      genesisID: 'testnet-v1.0',
      genesisHash: 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
    }),
  ];
}
