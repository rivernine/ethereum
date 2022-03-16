const { LazyMinter } = require('./LazyMinter.js')

async function main() {
  const [signer] = await ethers.getSigners();

  console.log("Signer account:", signer.address);
  const UniqueAlphaDev = await ethers.getContractFactory('UniqueAlphaDev')
  const uniqueAlphaDev = await UniqueAlphaDev.attach('0x5EB8997ee04e5D9b63BCeE48Ba1e10579f02c13F')
  const lazyMinter = new LazyMinter({ contract: uniqueAlphaDev, signer: signer })
  const tokenId = 1

  const voucher = await lazyMinter.createVoucher(tokenId)

  console.log("Voucher #" + tokenId)
  console.log(voucher)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// deploy to hardhat virtual network
// 실행: npx hardhat run scripts/createVoucher.js
//
// deploy to remote test network
// 실행: npx hardhat run scripts/createVoucher.js --network <network-name>