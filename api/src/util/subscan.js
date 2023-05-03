const axios = require("axios");
const secretManager = require("../util/secret_manager");

const getAllNFTs = async (walletAddress, tokenAddresses) => {
  let subscanAPIKey = null;

  if (process.env.USE_SECRET_MANAGER === "true") {
    const region = process.env.SECRET_MANAGER_REGION;
    const secretName = process.env.SECRET_MANAGER_SUBSCAN_API_KEY_SECRET_NAME;
    const subscanAPIKeyResponse = await secretManager.getSecretByKey(secretName, region);
    if (subscanAPIKeyResponse) {
      subscanAPIKey = JSON.parse(subscanAPIKeyResponse).subscan_api_key;
    }
  } else {
    subscanAPIKey = process.env.SUBSCAN_API_KEY;
  }

  if (!subscanAPIKey) {
    logger.error('Can not get subscan API KEY.');
    return {
      message: 'System error'
    }
  }

  //get all nfts
  let allNFTs = [];
  if (process.env.SUBSCAN_END_POINT_TOKEN_TRANSFER) {
    allNFTs.push(...await executeSubscanAPI(
        subscanAPIKey, process.env.SUBSCAN_END_POINT_TOKEN_TRANSFER, walletAddress));
  }
  if (allNFTs.length === 0 ) {
    allNFTs.push(...await executeSubscanAPI(
        subscanAPIKey, process.env.SUBSCAN_END_POINT, walletAddress));
  }

  // Get all nft of userAddress whose address belongs to tokenAddress
  return allNFTs.filter(e => tokenAddresses.includes(e.contract));
}

const executeSubscanAPI = async (subscanAPIKey, subscanEndpointUrl, walletAddress) => {
  let count = 100, page = 0;
  const allNFTs = [];
  let dataCount = 0;
  while (page === 0 || dataCount >= count) {
    const response = await axios({
      method: 'post',
      url: subscanEndpointUrl,
      headers: {
        "X-API-Key": subscanAPIKey
      },
      data: {
        address: walletAddress.toLowerCase(),
        row: count,
        page: page,
      },
      timeout: 10000,
      validateStatus: () => true,
    });

    try {
      dataCount = response.data.data.count;
      if (response.data.data.list.length == 0) {
        break;
      }
    } catch (e) {
      break;
    }

    allNFTs.push(...response.data.data.list);
    page++;
  }
  return allNFTs;
}

module.exports = {
  getAllNFTs
};
