import { Address } from "./accounts";
import { ACTIONS } from "./actions";

export class Transaction {
  public senderNodeId: string;
  public senderAddress: Address;
  public recipientNodeId: string;
  public recipientAddress: Address;
  public value: number;
  public transactionType: string;
  public senderDigitalSignature: string;
  public nonce: number;

  constructor(
    senderNodeId: string,
    senderAddress: Address,
    recipientAddress: Address,
    recipientNodeId: string,
    value: number,
    transactionType: string,
    nonce: number,
    senderDigitalSignature?: string
  ) {
    this.senderNodeId = senderNodeId;
    this.senderAddress = senderAddress;
    this.recipientNodeId = recipientNodeId;
    this.recipientAddress = recipientAddress;
    this.value = value;
    this.nonce = nonce;
    this.transactionType = transactionType;
    this.senderDigitalSignature = senderDigitalSignature;
  }
}


export class AccountTransaction extends Transaction {
  constructor(
    senderNodeId: string,
    senderAddress: Address,
    recipientAddress: Address,
    recipientNodeId: string,
    value: number,
    transactionType: string,
    nonce: number,
    senderDigitalSignature?: string
  ) {
    super(
      senderNodeId,
      senderAddress,
      recipientAddress,
      recipientNodeId,
      value,
      transactionType,
      nonce,
      senderDigitalSignature
    );
  }
}
