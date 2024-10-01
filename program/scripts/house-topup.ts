import dotenv from "dotenv";
import path from "node:path";
import { Transaction } from "@mysten/sui/transactions";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { Client } from './libs/client';
import { readJsonForNetwork, color } from './libs/utils';

dotenv.config();

(async () => {
  const client = new Client({
    network: 'devnet',
    secretKey: process.env.SECRET_KEY,
  });

  console.info('Active-address: ', color('green')(client.wallet.address));
  console.info('Active-env: ', color('green')(client.network));

  // === Top Up Balance House ===
  const packagePath = path.join(__dirname, '../coin_flip');
  const resultData = readJsonForNetwork(packagePath, client.network);
  const packageId = resultData.packageId;
  const houseDataId = resultData.houseDataId;
  const houseStakeSui = 2;

  const txb = new Transaction();
  const [houseStakeCoin] = txb.splitCoins(txb.gas, [
    MIST_PER_SUI * BigInt(houseStakeSui),
  ]);

  txb.moveCall({
    target: `${packageId}::house_data::top_up`,
    arguments: [
      txb.object(houseDataId),
      houseStakeCoin,
    ],
  });

  const houseTopupTxbResponse = await client.suiClient.signAndExecuteTransaction({
    transaction: txb,
    signer: client.wallet.keypair,
    options: { showEffects: true, showObjectChanges: true },
  });

  console.info(houseTopupTxbResponse);
})();