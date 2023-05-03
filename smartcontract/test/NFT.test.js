const chai = require('chai');
const { solidity } = require('ethereum-waffle');

chai.use(solidity);
const expect = chai.expect;

// https://ethereum-waffle.readthedocs.io/en/latest/matchers.html
describe('NFT', () => {
  let organization, ORGANIZATION;
  let owner, admin, burnedTokenHolder, user, userReceive;

  const baseURI = 'https://{domain}/v1/file-download/nft/';
  const maxSupply = 10;
  const name = 'NFT';
  const symbol = 'SGW';

  beforeEach(async () => {
    [owner, admin, burnedTokenHolder, user, userReceive] = await ethers.getSigners();

    ORGANIZATION = await ethers.getContractFactory('NFT', admin);
    organization = await ORGANIZATION.deploy(name, symbol, baseURI, maxSupply);
    await organization.deployed();
  });

  it('mint', async () => {
    await expect(organization.connect(admin).mint(user.address, 2, 2)).to.be.revertedWith(
      'tokenIdStart should set 1'
    );

    await organization.connect(admin).mint(user.address, 1, 1);

    expect(await organization.ownerOf(1)).to.equal(user.address);

    await expect(organization.burn(1)).to.be.revertedWith(
      'ERC721: caller is not token owner or approved'
    );

    await organization.connect(user).burn(1)
    await expect(organization.ownerOf(1)).to.be.revertedWith(
      'ERC721: invalid token ID'
    );
  });

  it('burn', async () => {
    await organization.connect(admin).mint(user.address, 1, 3);

    const burnedTokenId = 3;

    expect(await organization.ownerOf(burnedTokenId)).to.equal(user.address);

    await expect(organization.burn(burnedTokenId)).to.be.revertedWith(
      'ERC721: caller is not token owner or approved'
    );

    await organization.connect(user).burn(burnedTokenId)
    await expect(organization.ownerOf(burnedTokenId)).to.be.revertedWith(
      'ERC721: invalid token ID'
    );
  });

  it('max supply', async () => {
    await expect(
      organization.connect(admin).mint(user.address, 1, 11)
    ).to.be.revertedWith(
      'tokenIdEnd too big'
    );
  });

  it('transfer', async () => {
    await organization.connect(admin).mint(user.address, 1, 10);
    const transferedTokenId = 1;

    expect(await organization.ownerOf(transferedTokenId)).to.equal(user.address);

    await organization.connect(user).transferFrom(
      user.address,
      userReceive.address,
      transferedTokenId
    );
    expect(await organization.ownerOf(transferedTokenId)).to.equal(userReceive.address);
  });

  it('tokenURI', async () => {
    await organization.connect(admin).mint(user.address, 1, 10);
    const tokenId = 1;
    expect(await organization.tokenURI(tokenId)).to.equal(`${baseURI}${tokenId}.json`);
  });

  it('setBaseURI', async () => {
    await organization.connect(admin).mint(user.address, 1, 10);
    const tokenId = 1;
    expect(await organization.tokenURI(tokenId)).to.equal(`${baseURI}${tokenId}.json`);

    const newBaseURI = 'https://dev-re-vision.link/v1/file-download/nft/';
    await organization.connect(admin).setBaseURI(newBaseURI);
    expect(await organization.tokenURI(tokenId)).to.equal(`${newBaseURI}${tokenId}.json`);

  });

});
