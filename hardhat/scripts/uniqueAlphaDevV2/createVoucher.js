const { LazyMinter } = require('./LazyMinter.js')

async function main() {
  const [signer] = await ethers.getSigners();

  console.log("Signer account:", signer.address);
  const UniqueAlphaDevV2 = await ethers.getContractFactory('UniqueAlphaDevV2')
  const uniqueAlphaDevV2 = await UniqueAlphaDevV2.attach('0x236F20c038eB2803AA4536675162F992aC002E42')
  const lazyMinter = new LazyMinter({ contract: uniqueAlphaDevV2, signer: signer })
  const uri = 'ipfs://QmVm3Lc4DaGozyiFD5Dj2xKS9p1ZLxD9xETtAVQVV5PTMX'

  const voucher = await lazyMinter.createVoucher(uri)
    
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