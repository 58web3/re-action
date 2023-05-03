## SBT
EIP-5192: Minimal Soulbound NFT.

- SBT inherits ERC-721
- ERC-721 functions of the contract that transfer the token from one account to another must throw error.

Contract inherits
- `@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol`
- `@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol`
- `@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol`
- `@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol`
- `@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol`
- `@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol`

### Contract name
SBT.sol

### State variables
- TOTAL_SUPPLY: uint256 public  

### Constructor
#### Parameters
- name: string
- symbol: string
- totalSupply: uint256

#### Processing Details
```
ERC721(Parameters.name, Parameters.symbol)
TOTAL_SUPPLY = Parameters.totalSupply
```

### Method: mint 
#### Parameters
- to: address 
- tokenId: uint256
- tokenUri: string

#### Processing Details
1. Check onlyOwner, if has not role, throw `No permission` error
2. If tokenId > TOTAL_SUPPLY, throw `tokenId too big` error.
3. If balanceOf(to) != 0, throw `Already have` error.
4. Call _safeMint(to, tokenId) to mint
5. Call _setTokenURI(newItemId, tokenURI) to store token URI.

### Method: _beforeTokenTransfer
Only allow mint method

```
function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
) internal pure override {
    // mint or burn
    require(from == address(0) || to == address(0), 'Unable to transfer SBT');
}
```

※reference url: https://docs.opensea.io/docs/4-setting-a-price-and-supply-limit-for-your-contract
