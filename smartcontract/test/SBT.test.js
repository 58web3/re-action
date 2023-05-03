const chai = require('chai');
const { solidity } = require('ethereum-waffle');

chai.use(solidity);
const expect = chai.expect;

// https://ethereum-waffle.readthedocs.io/en/latest/matchers.html
describe('SBTUpgradeable', () => {
  let organization, ORGANIZATION;
  let owner, admin, burnedTokenHolder, user, userReceive;

  const baseURI = 'https://{domain}/v1/file-download/nft';
  const baseURI1 = 'https://{domain}/v1/file-download/nft/1';
  const baseURI2 = 'https://{domain}/v1/file-download/nft/2';
  const maxSupply = 10;
  const name = 'NFT';
  const symbol = 'SGW';

  beforeEach(async () => {
    [owner, admin, burnedTokenHolder, user, userReceive] = await ethers.getSigners();

    ORGANIZATION = await ethers.getContractFactory('SBTUpgradeable', admin);
    organization = await upgrades.deployProxy(ORGANIZATION, [
      name, symbol, maxSupply
    ]);
    await organization.deployed();
  });

  it('mint', async () => {
    await expect(organization.connect(admin).mint(user.address, 11, baseURI)).to.be.revertedWith(
      'TokenId too big'
    );

    await organization.connect(admin).mint(user.address, 1, baseURI);

    expect(await organization.ownerOf(1)).to.equal(user.address);

    await expect(organization.connect(admin).mint(user.address, 1, baseURI)).to.be.revertedWith(
      'Already have'
    );

    await expect(organization.connect(admin).mint(userReceive.address, 1, baseURI)).to.be.revertedWith(
      'ERC721: token already minted'
    );

    await expect(organization.connect(admin).mint(userReceive.address, 2, '')).to.be.revertedWith(
      'TokenUri should be set'
    );

    await organization.connect(admin).mint(userReceive.address, 2, baseURI);

    expect(await organization.ownerOf(2)).to.equal(userReceive.address);
  });

  it('burn', async () => {
    await organization.connect(admin).mint(user.address, 1, baseURI);

    const burnedTokenId = 1;

    expect(await organization.ownerOf(burnedTokenId)).to.equal(user.address);

    await expect(organization.burn(burnedTokenId)).to.be.revertedWith(
      'ERC721: caller is not token owner or approved'
    );

    await organization.connect(user).burn(burnedTokenId);
    await expect(organization.ownerOf(burnedTokenId)).to.be.revertedWith(
      'ERC721: invalid token ID'
    );
  });

  it('max supply', async () => {
    await expect(
      organization.connect(admin).mint(user.address, 11, baseURI)
    ).to.be.revertedWith(
      'TokenId too big'
    );
  });

  it('transfer from: cannot transfer to another address', async () => {
    await organization.connect(admin).mint(user.address, 1, baseURI);
    const transferedTokenId = 1;

    expect(await organization.ownerOf(transferedTokenId)).to.equal(user.address);

    await expect(organization.connect(user).transferFrom(
      user.address,
      userReceive.address,
      transferedTokenId
    )).to.be.revertedWith(
      ''
    );
  });

  it('tokenURI', async () => {
    const tokenId = 1;
    const tokenId2 = 2;

    await organization.connect(admin).mint(user.address, tokenId, baseURI1);

    expect(await organization.tokenURI(tokenId)).to.equal(baseURI1);
    await expect(organization.tokenURI(tokenId2)).to.be.revertedWith(
      'ERC721: invalid token ID'
    );

    await organization.connect(user).burn(tokenId);
    await expect(organization.ownerOf(tokenId)).to.be.revertedWith(
      'ERC721: invalid token ID'
    );
    await expect(organization.tokenURI(tokenId)).to.be.revertedWith(
      'ERC721: invalid token ID'
    );

    await organization.connect(admin).mint(user.address, tokenId2, baseURI2);
    expect(await organization.tokenURI(tokenId2)).to.equal(baseURI2);
  });
});