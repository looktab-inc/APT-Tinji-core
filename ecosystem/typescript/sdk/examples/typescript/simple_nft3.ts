// Copyright (c) Aptos
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-console */

import dotenv from "dotenv";
dotenv.config();

import { AptosClient, AptosAccount, FaucetClient, TokenClient, CoinClient } from "aptos";
import { NODE_URL, FAUCET_URL } from "./common";
import { bcsSerializeBool, bcsSerializeStr } from "../../src/bcs";

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

  // Admin = Alice
  // Receiver = Bob

  const privateKeyObject = {privateKeyHex: "0x0c8d7267e32551957f9d9a0eb4485feda203acad142516ef967b7dd19acda9af"};
  const admin = AptosAccount.fromAptosAccountObject(privateKeyObject);

  const privateKeyObject2 = {privateKeyHex: "0xfcf4246f35cd738f0cb3dafba945031549e4a2c17fde32a74a77871225ec5467"};//내거
  // const privateKeyObject2 = {privateKeyHex: "0x55b25d15737694ebd36672900ae514ca13aaaf676a1f48615ffd4e0637e0a472"};//유정님거
  const receiver = AptosAccount.fromAptosAccountObject(privateKeyObject2); // <:!:section_2
  // <:!:section_2

  // Print out account addresses.
  console.log("=== Addresses ===");
  console.log(`Alice: ${admin.address()}`);
  console.log(`Bob: ${receiver.address()}`);
  console.log("");

  // Fund accounts.
  // :!:>section_3
  await faucetClient.fundAccount(admin.address(), 100_000_000);
  await faucetClient.fundAccount(receiver.address(), 100_000_000); // <:!:section_3

  console.log("=== Initial Coin Balances ===");
  console.log(`Alice: ${await coinClient.checkBalance(admin)}`);
  console.log(`Bob: ${await coinClient.checkBalance(receiver)}`);
  console.log("");

  console.log("=== Creating Collection and Token ===");

  const collectionName = "test8";
  const tokenName = "0";
  const tokenPropertyVersion = 0;

  // const tokenId = {
  //   token_data_id: {
  //     creator: admin.address().hex(),
  //     collection: collectionName,
  //     name: tokenName,
  //   },
  //   property_version: `${tokenPropertyVersion}`,
  // };

  // Create the collection.
  // :!:>section_4
  const txnHash1 = await tokenClient.createCollection(
    admin,
    collectionName,
    "Special coupon for you",
    "https://tinji.com",
    20 // Maximum number of token_data allowed within this
  ); // <:!:section_4
  await client.waitForTransaction(txnHash1, { checkSuccess: true });

  // Create a token in that collection.
  // :!:>section_5

  const txnHash2 = await tokenClient.createTokenWithMutabilityConfig(
    admin,
    collectionName,
    tokenName,
    "Special coupon for you",
    1, //supply
    "https://aptos.dev/img/nyan.jpeg",
    1, //The maxium of tokens can be minted from this token
    admin.address(),
    1,
    0,
    ['like', 'used', 'fee', 'startDate', 'endDate', 'zipCode', 'localAddress', 'localRange'],
    [bcsSerializeBool(true), bcsSerializeBool(false), bcsSerializeStr('1000'), bcsSerializeStr('1675342107'), bcsSerializeStr('1675349107'), bcsSerializeStr('08018'), bcsSerializeStr('Seoul Gangnamgu'), bcsSerializeStr('10')],
    ['bool', 'bool', 'string', 'string', 'string', 'string','string','string'],//type
    [false, false, false, false, true],
  ); // <:!:section_5

  await client.waitForTransaction(txnHash2, { checkSuccess: true });

  const txnHash2_1 = await tokenClient.mutateTokenProperties(
    admin,
    admin.address(),
    admin.address(),
    collectionName,
    tokenName,
    0,//property version
    1,
    ['like', 'used', 'fee', 'startDate', 'endDate', 'zipCode', 'localAddress', 'localRange'],
    [bcsSerializeBool(true), bcsSerializeBool(false), bcsSerializeStr('1000'), bcsSerializeStr('1675342107'), bcsSerializeStr('1675349107'), bcsSerializeStr('08018'), bcsSerializeStr('Jeju'), bcsSerializeStr('10')],
    ['bool', 'bool', 'string', 'string', 'string', 'string','string','string'],//type
  );
  await client.waitForTransaction(txnHash2_1, { checkSuccess: true });

  // const txnHash2_1 = await tokenClient.createToken(
  //   admin,
  //   collectionName,
  //   "1",
  //   "Special coupon for you",
  //   1, //supply
  //   "https://aptos.dev/img/nyan.jpeg",
  //   10, //The maxium of tokens can be minted from this token
  //   admin.address(),
  //   1,
  //   0,
  //   ['like', 'used', 'fee', 'startDate', 'endDate', 'zipCode', 'localAddress', 'localRange'],
  //   ['true', 'false','1000', '1675342107', '1675349107', '08018', 'Seoul Gangnamgu', '10'],
  //   ['bool', 'bool', 'u128', 'string', 'string', 'string','string','u64'],//type
  // ); // <:!:section_5

  // await client.waitForTransaction(txnHash2_1, { checkSuccess: true });

  // // Print the collection data.
  // // :!:>section_6
  // const collectionData = await tokenClient.getCollectionData(admin.address(), collectionName);
  // console.log(`Alice's collection: ${JSON.stringify(collectionData, null, 4)}`); // <:!:section_6

  // // Get the token balance.
  // // :!:>section_7
  // const aliceBalance1 = await tokenClient.getToken(
  //   admin.address(),
  //   collectionName,
  //   tokenName,
  //   `${tokenPropertyVersion}`,
  // );
  // console.log(`Alice's token balance: ${aliceBalance1["amount"]}`); // <:!:section_7

  // // Get the token data.
  // // :!:>section_8
  const tokenData = await tokenClient.getTokenData(admin.address(), collectionName, tokenName);
  console.log(`Alice's token data8: ${JSON.stringify(tokenData, null, 4)}`); // <:!:section_8


  console.log("\n=== Test NFT 낱개조회 ===");


  const tokenStore: {data: any} = await client.getAccountResource(
    admin.address(),
    "0x3::token::TokenStore"
  );

    const { handle } = tokenStore.data.tokens;
    const tokenData1 = await client.getTableItem(handle, {
      key_type: "0x3::token::TokenId",
      value_type: "0x3::token::Token",
      key: {
        token_data_id: {
          creator: admin.address().hex(),
          collection: collectionName,
          name: tokenName,
        },
          property_version: "1"
      },
    })

    // console.log(tokenData1);
    console.log(tokenData1.token_properties.map.data);

    // console.log("\n=== 계좌 잔액 조회 ===");
    // console.log(`Alice: ${await coinClient.checkBalance(admin)}`);
    // https://fullnode.devnet.aptoslabs.com/accounts/{address}/resource/0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>

    // console.log("\n=== 거래 히스토리 조회 ===");
    //https://fullnode.devnet.aptoslabs.com/v1/accounts/0x516f33eddd97b058868347d215392fd5bf20b223beadcd89ac62628ac7cad6c1/transactions
})();
