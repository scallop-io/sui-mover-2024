import dotenv from "dotenv";
import path from "node:path";
import { Client } from './libs/client';
import { Publisher } from './libs/publisher';
import { color } from './libs/utils';
import type { PublishPackageResult } from './libs/types';

dotenv.config();

const coinFlipResultPaser = (publishPackageResult: PublishPackageResult) => {
  const houseCapObjectType = `${publishPackageResult.packageId}::house_data::HouseCap`;
  const houseCapId = publishPackageResult.created.find((created) => created.type === houseCapObjectType)?.objectId;
  return houseCapId ? { houseCapId } : {}; 
};

(async () => {
  const client = new Client({
    network: 'devnet',
    secretKey: process.env.SECRET_KEY,
  });

  console.info('Active-address: ', color('green')(client.wallet.address));
  console.info('Active-env: ', color('green')(client.network));

  // === Single Package Publish ===
  const suiBinaryPath = 'sui';
  const packagePath = path.join(__dirname, '../coin_flip');
  const publisher = new Publisher(suiBinaryPath, client);
  const publishResult = await publisher.publish(packagePath, { enforce: true, resultParser: coinFlipResultPaser});
  console.info('Publish Result:', publishResult);

  // === Batch Package Publish ===
  // const batchParams = [
  //   { packagePath: path.join(__dirname, '../package_b'), option: { enforce: true } },
  //   { packagePath: path.join(__dirname, '../package_a'), option: { enforce: true } },
  // ];
  // const publisher = new Publisher('sui-devnet', client);
  // await publisher.publishBatch(batchParams);
})();