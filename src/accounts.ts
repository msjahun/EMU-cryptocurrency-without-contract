import * as fs from "fs";
import axios from "axios";
import * as path from "path";
const ursa = require("ursa");
import { Blockchain } from "./blockchain";
import { Node } from "./node";
import { generateAccountKeys } from "./asymmetric_encryption/generate_rsa_keys";
import { AccountTransaction } from "./transaction";
import { ACTIONS } from "./actions";

export type Address = string;
export type EXTERNAL_ACCOUNT_TYPE = Address;
export const EXTERNAL_ACCOUNT = "EXTERNAL_ACCOUNT";

export class Account {
  public address: Address;
  public balance: number;
  public type: string;
  public nonce: number;

  constructor(address: Address, balance: number, type: string) {
    this.address = address;
    this.balance = balance;
    this.type = type;
    this.nonce = 0;
  }
}

export class ExternalAccount extends Account {
  public publicKey: any;
  private privateKey: any;
  private storagePath: string;

  constructor(address: Address, balance: number, type: string, id: string) {
    super(address, balance, type);
    this.storagePath = path.resolve(
      __dirname,
      "../",
      "RSAKeys",
      `${address}Keys`
    );

    this.createRSAKeys(address);
  }

  createTransaction(
    senderNodeId: string,
    senderAddress: Address,
    recipientAddress: Address,
    recipientNodeId: string,
    value: number,
    action: string,
    digitalSignature: string
  ) {
    return new AccountTransaction(
      senderNodeId,
      senderAddress,
      recipientAddress,
      recipientNodeId,
      value,
      action,
      this.nonce,
      digitalSignature
    );
  }

  async createRSAKeys(address: Address) {
    const { privpem, pubpem } = await generateAccountKeys(address);
    this.privateKey = ursa.createPrivateKey(
      fs.readFileSync(`${this.storagePath}/privkey.pem`)
    );
    this.publicKey = ursa.createPublicKey(
      fs.readFileSync(`${this.storagePath}/pubkey.pem`)
    );
  }

  getPublicKey() {
    return fs.readFileSync(`${this.storagePath}/pubkey.pem`, "utf8");
  }

  // TODO: Encrypting usually work with someone elses key.. This is weird
  encryptActionRequest(action: string): string {
    return this.publicKey.encrypt(action, "utf8", "base64");
  }

  decryptActionRequest(action: string): string {
    return this.privateKey.decrypt(action, "base64", "utf8");
  }

  createDigitalSignature(action: string): string {
    return this.privateKey.hashAndSign(
      "sha256",
      Buffer.from(action, "utf8"),
      "utf8",
      "base64"
    );
  }

  verifyDigitalSignature(action: string, signature: string) {
    return this.publicKey.hashAndVerify(
      "sha256",
      Buffer.from(action, "utf8"),
      signature,
      "base64"
    );
  }
}




