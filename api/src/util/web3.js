const rpcUrl = process.env.SHIBUYA_RPC;
const abiContractSBT = require('../../contracts/SBT.sol/SBT.json').abi;
const abiContractNFT = require('../../contracts/NFT.sol/NFT.json').abi;
const Web3 = require('web3');
const web3 = new Web3(rpcUrl);
const axios = require('axios');
const NodeCache = require("node-cache");
// cache time: 1hour
const cache = new NodeCache({ stdTTL: 3600 });

const ethSignerKms = require('@rumblefishdev/eth-signer-kms');
const ethers = require('ethers');
const AWS = require('aws-sdk');
const kms = new AWS.KMS({
  region: process.env.AWS_KMS_REGION
});
const KMS_KEY_ID = process.env.KMS_KEY_ID;

const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
const kmsSigner = new ethSignerKms.KMSSigner(provider, KMS_KEY_ID, kms);

const transfer = async (tokenAddress, receiveAddress, tokenId) => {
  const nftContract = new web3.eth.Contract(abiContractNFT, tokenAddress);

  const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;
  let adminWalletAddress = null;

  const useKMSAccount = "true" === process.env.USE_KMS_ACCOUNT;
  logger.info(`Use KMS account: ${useKMSAccount}`);
  if (useKMSAccount) {
    adminWalletAddress = await ethSignerKms.getEthAddressFromKMS({ kmsInstance: kms, keyId: KMS_KEY_ID })
  } else {
    adminWalletAddress =
      web3.eth.accounts.privateKeyToAccount(adminPrivateKey).address;
  }
  logger.info(`Admin wallet address: ${adminWalletAddress}`);

  // const gasLimit = await nftContract.methods
  //   .transferFrom(adminWalletAddress, receiveAddress, tokenId)
  //   .estimateGas({ from: adminWalletAddress });
  const gasPrice = +(await web3.eth.getGasPrice()) * 1.4; // Increase gas price 40%
  const data = nftContract.methods
    .transferFrom(adminWalletAddress, receiveAddress, tokenId)
    .encodeABI();

  const tx = {
    data: data,
    from: adminWalletAddress,
    to: tokenAddress,
    gasLimit: Number(process.env.GAS_LIMIT || 400000),
    gasPrice: gasPrice,
  };

  let txhash;
  let messageError;

  if (useKMSAccount) {

    const transfer = await kmsSigner.sendTransaction(tx);
    txhash = transfer.hash;
    messageError = await getRevertReason(txhash, data);
  } else {
    const signedTransferTx = await web3.eth.accounts
      .signTransaction(tx, adminPrivateKey)
      .catch((e) => {
        logger.error(e);
      });

    await web3.eth
      .sendSignedTransaction(signedTransferTx.rawTransaction)
      .on("transactionHash", function (hash) {
        txhash = hash;
      })
      .catch(async (e) => {
        messageError = await getRevertReason(e.receipt?.transactionHash, data);
        logger.error(e);
      });

  }
  logger.info(`transfer transaction hash: ${txhash}`);

  return {
    txhash,
    messageError
  }
}

const mint = async (contractAddress, userWallet, tokenId, tokenURI) => {
  const nftContract = new web3.eth.Contract(abiContractSBT, contractAddress);

  const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;
  let adminWalletAddress = null;

  const useKMSAccount = "true" === process.env.USE_KMS_ACCOUNT;
  logger.info(`Use KMS account: ${useKMSAccount}`);
  if (useKMSAccount) {
    adminWalletAddress = await ethSignerKms.getEthAddressFromKMS({ kmsInstance: kms, keyId: KMS_KEY_ID })
  } else {
    adminWalletAddress =
      web3.eth.accounts.privateKeyToAccount(adminPrivateKey).address;
  }
  logger.info(`Admin wallet address: ${adminWalletAddress}`);

  const gasPrice = +(await web3.eth.getGasPrice()) * 1.4; // Increase gas price 40%
  const data = nftContract.methods
    .mint(userWallet, tokenId, tokenURI)
    .encodeABI();

  const tx = {
    data: data,
    from: adminWalletAddress,
    to: contractAddress,
    gasLimit: Number(process.env.GAS_LIMIT || 400000),
    gasPrice: gasPrice,
  };

  let txhash;
  let messageError;

  if (useKMSAccount) {
    let mint;
    mint = await kmsSigner.sendTransaction(tx);
    txhash = mint.hash;
    messageError = await getRevertReason(txhash, data);
  } else {
    const signedTransferTx = await web3.eth.accounts
      .signTransaction(tx, adminPrivateKey)
      .catch((e) => {
        logger.error(e);
      });

    await web3.eth
      .sendSignedTransaction(signedTransferTx.rawTransaction)
      .on("transactionHash", function (hash) {
        txhash = hash;
      })
      .catch(async (e) => {
        messageError = await getRevertReason(e.receipt?.transactionHash, data);
        logger.error(e);
      });

  }
  logger.info(`mint transaction hash: ${txhash}`);

  return {
    txhash,
    messageError
  }
}

const getTokenURI = async (tokenAddress, tokenId) => {
  try {
    const key = "tokenURI" + tokenAddress;
    if (cache.has(key)) {
      return cache.get(key) + tokenId + '.json';
    } else {
      const nftContract = new web3.eth.Contract(abiContractNFT, tokenAddress);
      const tokenURI = await nftContract.methods.tokenURI(tokenId).call();
      const lastIndex = tokenURI.lastIndexOf("/");
      const pathTokenURI = tokenURI.slice(0, lastIndex + 1);
      cache.set(key, pathTokenURI);
      return tokenURI;
    }
  } catch (e) {
    logger.error(e);
    return null;
  }
}

const getMetadata = async (tokenUri) => {
  try {
    if (tokenUri.startsWith('ipfs://')) tokenUri = tokenUri.replace('ipfs://', process.env.IPFS_GATEWAY_URL);

    const metadata = await axios.get(tokenUri);

    if (metadata && metadata.data) {
      return metadata.data;
    }
  } catch (e) {
    logger.error(e);
    return null;
  }
}

const getImageUrl = async (imageUrl) => {
  try {
    if (imageUrl.startsWith('ipfs://')) imageUrl = imageUrl.replace('ipfs://', process.env.IPFS_GATEWAY_URL);

    return imageUrl;
  } catch (e) {
    logger.debug(e)
    return "";
  }
}

const fromWei = async (number, unit = 'ether') => {
  return web3.utils.fromWei(number, unit);
}

const getRevertReason = async (txHash, data) => {
  let receipt = await getTransactionReceipt(
    txHash
  );

  // wait until the transaction is successful
  if (!receipt ) {
    do {
      await new Promise(r => setTimeout(r, 2000));
      receipt = await getTransactionReceipt(
        txHash
      );
    } while (!receipt)
  }

  // check transaction error occurred
  if (!receipt.status) {
    const tx = await web3.eth.getTransaction(txHash);

    try {
      await web3.eth.call({
        to: tx.to,
        data: data
      }, tx.blockNumber);
    } catch (err) {
      if (err.data) {
        const result = err.data.startsWith('0x') ? err.data : `0x${err.data}`;
        const reason = web3.utils.toAscii(`0x${result.substr(138)}`);
        return reason.toString();
      }
    }
    return 'Cannot get reason - No return value';
  }
  return;
}

const getTransactionReceipt = async (txHash) => {
  try {
    return await web3.eth.getTransactionReceipt(txHash);
  } catch (error) {
    throw error;
  }
}
module.exports = {
  mint,
  transfer,
  fromWei,
  getTokenURI,
  getMetadata,
  getImageUrl,
  getRevertReason
};
