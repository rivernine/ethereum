const { LazyMinter } = require('./LazyMinter.js')

async function main() {
  const [signers] = await ethers.getSigners();

  console.log("Signer account:", signers.address);  
  const contract = '0xA179601CF4B7F7D4BC6280eafdE0432F54Fa1908'
  const lazyMinter = new LazyMinter({ contract, signers })
  const tokenId = 0

  const voucher = await lazyMinter.createVoucher(tokenId)

  console.log("Voucher #" + tokenId + ": " + voucher)
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