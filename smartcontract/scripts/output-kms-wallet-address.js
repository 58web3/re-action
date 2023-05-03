const hre = require("hardhat");
const ethers = hre.ethers;

const main = async () => {
  const accounts = await hre.ethers.getSigners();
  console.log("=======out kms wallet address=======start");
  console.log(accounts[0].address);
  console.log("=======out kms wallet address=======end");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
