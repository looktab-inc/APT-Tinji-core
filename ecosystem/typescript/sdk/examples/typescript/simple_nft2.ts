// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-console */

import dotenv from "dotenv";
dotenv.config();

import { AptosClient, AptosAccount, FaucetClient, TokenClient, CoinClient } from "aptos";
import { NODE_URL, FAUCET_URL } from "./common";

(async () => {
  // Create API and faucet clients.
  // :!:>section_1a
  const client = new AptosClient(NODE_URL);
  const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL); // <:!:section_1a

  // Create client for working with the token module.
  // :!:>section_1b
  const tokenClient = new TokenClient(client); // <:!:section_1b

  // Create a coin client for checking account balances.
  const coinClient = new CoinClient(client);

  // Create accounts.
  // :!:>section_2
  const privateKeyObject = {privateKeyHex: "0x5afd0e2596658a7631dc234aff67f85d9a7871c226888bb568bbd3279ce545da"};
  const sender = AptosAccount.fromAptosAccountObject(privateKeyObject);
  // const privateKeyObject2 = {privateKeyHex: "0xfcf4246f35cd738f0cb3dafba945031549e4a2c17fde32a74a77871225ec5467"};
  // const bob = AptosAccount.fromAptosAccountObject(privateKeyObject2); // <:!:section_2
  const receiver = "0x516f33eddd97b058868347d215392fd5bf20b223beadcd89ac62628ac7cad6c1";

  let txnHash5 = await tokenClient.transferWithOptIn(
    sender,
    sender.address(),
    'test6',
    '0',
    1,
    receiver,
    1,
    ); // <:!:section_11
  await client.waitForTransaction(txnHash5, { checkSuccess: true });
  
})();
