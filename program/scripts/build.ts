import dotenv from "dotenv";
import path from "node:path";
import { Client } from './libs/client';
import { Publisher } from './libs/publisher';
import { color } from './libs/utils';

dotenv.config();

(async () => {
  const client = new Client({
    network: 'devnet',
    secretKey: process.env.SECRET_KEY,
  });

  console.info('Active-address: ', color('green')(client.wallet.address));
  console.info('Active-env: ', color('green')(client.network));
  
  const packagePath = path.join(__dirname, '../custom_coin');
  const publisher = new Publisher('sui-devnet', client);
  const buildResult = publisher.build(packagePath);
  console.info('Build Result:', buildResult);
})();