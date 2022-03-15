const { LazyMinter } = require('./LazyMinter.js')

async function main() {
  const [signer] = await ethers.getSigners();

  console.log("Signer account:", signer.address);  
  const Unique = await ethers.getContractFactory('UniqueSample')
  const contract = await Unique.attach('0x13efF1702972b33bf7e839481Ad540B521f94601')
  const lazyMinter = new LazyMinter({ contract, signer })
  const tokenId = 3

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