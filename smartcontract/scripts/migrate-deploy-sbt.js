const hre = require('hardhat');
const ethers = hre.ethers;

let envFileName = '';
if (process.env.NODE_ENV === 'staging') {
  envFileName = '../.env.staging';
} else if (process.env.NODE_ENV === 'production') {
  envFileName = '../.env.production';
} else {
  envFileName = '../.env.development';
}
require('dotenv').config({ path: envFileName });
const config = process.env;

const main = async () => {
  // admin wallet private key
  const accounts = await hre.ethers.getSigners();
  const adminWalletAddress = accounts[0].address;
  console.log("admin wallet address: " + adminWalletAddress);
  
  // confirm max supply
  const maxSupply = config.SBT_MAX_SUPPLY;
  // only for test
  const name = config.SBT_NAME;
  const symbol = config.SBT_SYMBOL;

  SBT = await ethers.getContractFactory('SBT');
  sbt = await upgrades.deployProxy(SBT, [
    name, symbol, maxSupply
  ]);
  await sbt.deployed();

  console.log(`SBT address: ${sbt.address.toLowerCase()}`);
};


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
