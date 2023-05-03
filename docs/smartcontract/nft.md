## NFT
ERC-721 NON-FUNGIBLE TOKEN.

Contract inherits
- `@openzeppelin/contracts/token/ERC721/ERC721.sol`
- `@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol`
- `@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol`
- `@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol`
- `@openzeppelin/contracts/access/AccessControlEnumerable.sol`
- `@openzeppelin/contracts/utils/Context.sol`

### Contract name
NFT.sol

### State variables
- TOTAL_SUPPLY: uint256 public  
- currentTokenId: Counters.Counter private
- baseTokenURI: string public

### Constructor
#### Parameters
- name: string
- symbol: string
- baseTokenURI: string
- totalSupply: uint256

#### Processing Details
```
ERC721(Parameters.name, Parameters.symbol)
baseTokenURI = Parameters.baseTokenURI
TOTAL_SUPPLY = Parameters.totalSupply

_setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
_setupRole(MINTER_ROLE, _msgSender());
_setupRole(PAUSER_ROLE, _msgSender());
```

### Method: mint 
Method restriction: public

#### Parameters
- recipient: address 
- tokenIdStart: uint256 
- tokenIdEnd: uint256

#### Processing Details
1. Check MINTER_ROLE, if has not role, throw `No permission` error
2. If tokenIdEnd > maxSupply, throw `tokenIdEnd too big` error.
3. If tokenIdStart <= currentTokenId.current(), throw `Already minted` error.
4. If tokenIdEnd <= currentTokenId.current(), throw `Already minted` error.
5. If tokenIdStart != currentTokenId.current() + 1, throw `tokenIdStart should set {currentTokenId.current() + 1}` error.
6. Loop start: tokenIdStart to end: tokenIdEnd
- currentTokenId.increment()
- uint256 newTokenId = currentTokenId.current();
- _safeMint(recipient, newTokenId)

### Method: tokenURI 
Method: function tokenURI(uint256 tokenId) public view virtual override returns (string memory) 

#### Parameters
- tokenId: uint256
#### Processing Details
return _baseURI() + tokenId.toString() + ".json"

### Method: pause 
Method: function pause() public virtual

#### Parameters

#### Processing Details
1. If there is no PAUSER_ROLE role, throw error
2. Call _pause()

### Method: unpause 
Method: function unpause() public virtual

#### Parameters

#### Processing Details
1. If there is no PAUSER_ROLE role, throw error
2. Call _unpause()
