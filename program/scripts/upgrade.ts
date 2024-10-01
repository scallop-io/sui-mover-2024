import dotenv from "dotenv";
import path from "node:path";
import { Client } from './libs/client';
import { Publisher } from './libs/publisher';
import { color } from './libs/utils';
import { DependenciePaths } from './libs/types';

dotenv.config();

(async () => {
  const client = new Client({
    network: 'devnet',
    secretKey: process.env.SECRET_KEY,
  });
  // Get the packageId and upgradeCapId from `publish-result.${network}.json` in the package that you want to upgrade
  const packageId = '0x21589d279be196a9968f4eaa05332e38f36de2821e0dace3a19eab64d16baa6c';
  const upgradeCapId = '0x905a9129337df6b90b174b6bcda56492e6292393c8f19544646eaacffe0f251b';

  console.info('Active-address: ', color('green')(client.wallet.address));
  console.info('Active-env: ', color('green')(client.network));
  console.info('packageId: ', color('green')(packageId));
  console.info('upgradeCapId: ', color('green')(upgradeCapId));

  // === Package Upgrade without Dependencies ===
  // const packagePath = path.join(__dirname, '../custom_coin');
  // const publisher = new Publisher('sui-devnet', client);
  // const upgradeResult = await publisher.upgrade(packagePath, packageId, upgradeCapId);
  // console.info('Upgrade Result:', upgradeResult);

  // === Package Upgrade with Dependencies ===
  const packagePath = path.join(__dirname, '../package_a');
  const publisher = new Publisher('sui-devnet', client);
  const dependenciePaths: DependenciePaths = [
    { packagePath: path.join(__dirname, '../package_b') }
  ];
  const upgradeResult = await publisher.upgrade(packagePath, packageId, upgradeCapId, dependenciePaths);
  console.info('Upgrade Result:', upgradeResult);
})();