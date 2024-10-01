import dotenv from "dotenv";
import path from "node:path";
import { Transaction } from "@mysten/sui/transactions";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { bcs } from "@mysten/sui/bcs";
import { bls12_381 as bls } from "@noble/curves/bls12-381";
import * as curveUtils from "@noble/curves/abstract/utils";
import { Client } from './libs/client';
import { readJsonForNetwork, writeJsonForNetwork, color } from './libs/utils';
import type { SuiTransactionBlockResponse } from "@mysten/sui/client";

dotenv.config();

const paseTxbResponse = (response: SuiTransactionBlockResponse) => {
  console.log(response);
  let houseDataId;
  if (response.objectChanges) {
    for (const change of response.objectChanges) {
      if (change.type === 'created' && change.objectType.endsWith('house_data::HouseData')) {
        houseDataId = change.objectId;
      }
    }
  }
  return houseDataId;
};

(async () => {
  const client = new Client({
    network: 'devnet',
    secretKey: process.env.SECRET_KEY,
  });

  console.info('Active-address: ', color('green')(client.wallet.address));
  console.info('Active-env: ', color('green')(client.network));

  // === Initialize House Data ===
  const packagePath = path.join(__dirname, '../coin_flip');
  const resultData = readJsonForNetwork(packagePath, client.network);
  const packageId = resultData.packageId;
  const houseCapId = resultData.houseCapId;
  const houseStakeSui = 5;

  const txb = new Transaction();
  const [houseStakeCoin] = txb.splitCoins(txb.gas, [
    MIST_PER_SUI * BigInt(houseStakeSui),
  ]);

  const housePrivKey = bls.utils.randomPrivateKey();
  const housePubKey = bls.getPublicKey(housePrivKey);
  console.info('House PrivKey: ', color('green')(curveUtils.bytesToHex(housePrivKey)));
  console.info('House PubKey: ', color('green')(curveUtils.bytesToHex(housePubKey)));

  txb.moveCall({
    target: `${packageId}::house_data::initialize_house_data`,
    arguments: [
      txb.object(houseCapId),
      houseStakeCoin,
      // This argument is not an on-chain object, hence, we must serialize it using `bcs`
      // https://sdk.mystenlabs.com/typescript/transaction-building/basics#pure-values
      txb.pure(
        bcs
          .vector(bcs.U8)
          .serialize(housePubKey),
      ),
    ],
  });

  const houseInitTxbResponse = await client.suiClient.signAndExecuteTransaction({
    transaction: txb,
    signer: client.wallet.keypair,
    options: { showEffects: true, showObjectChanges: true },
  });

  const houseDataId = paseTxbResponse(houseInitTxbResponse);
  writeJsonForNetwork({
    ...resultData, houseDataId,
    housePrivKey: curveUtils.bytesToHex(housePrivKey)
  }, packagePath, client.network);
})();