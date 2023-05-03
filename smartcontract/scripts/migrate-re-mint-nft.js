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
  const accounts = await hre.ethers.getSigners();
  const adminWalletAddress = accounts[0].address;
  console.log("admin wallet address: " + adminWalletAddress);

  const nftAddress = config.NFT_ADDRESS;
  const start = config.NFT_MINT_START;
  const end = config.NFT_MINT_END
  
  if (!nftAddress || !start || !end) {
    console.log('Should add nftAddress, start, end variable before re-mint');
    return;
  }

  const NFT = await ethers.getContractFactory('AcnDaoNFT');
  const nft = await NFT.attach(nftAddress);
  console.log(`NFT address: ${nft.address.toLowerCase()}`);

  await nft.mint(adminWalletAddress, start, end);
  console.log(`minted ${end - start +1} tokens, start: ${start} end: ${end}`);
};


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
