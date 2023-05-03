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
  // deploy NFT
  const baseURI = config.NFT_BASE_URI;
  // confirm max supply
  const maxSupply = config.NFT_MAX_SUPPLY;
  // only for test
  const name = config.NFT_NAME;
  const symbol = config.NFT_SYMBOL;

  const NFT = await ethers.getContractFactory('AcnDaoNFT');
  const nft = await NFT.deploy(name, symbol, baseURI, maxSupply);
  await nft.deployed();

  console.log(`NFT address: ${nft.address.toLowerCase()}`);

  // default mint 100 tokens
  await nft.mint(adminWalletAddress, 1, 100);
  console.log("minted 100 tokens", 1, 100);
};


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
