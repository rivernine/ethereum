async function main() {
  const [minter, redeemer] = await ethers.getSigners();

  console.log("Redeemer account:", redeemer.address);
  console.log("Account balance:", (await redeemer.getBalance()).toString());

  const UniqueAlphaDevV2 = await ethers.getContractFactory('UniqueAlphaDevV2')
  const uniqueAlphaDevV2 = await UniqueAlphaDevV2.attach('0x236F20c038eB2803AA4536675162F992aC002E42')

  const voucher = {
    uri: 'ipfs://QmVm3Lc4DaGozyiFD5Dj2xKS9p1ZLxD9xETtAVQVV5PTMX',
    signature: '0xcca96b8e42290e61e9ef74e5ce8b7d7b90789e7417a12689e02f8528718cfbb848da2494851b074951f663ed172799b0120f7c848ff22952100d634960232d1f1c'
  }

  console.log(await uniqueAlphaDevV2.connect(redeemer).redeem(voucher))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// deploy to hardhat virtual network
// 실행: npx hardhat run scripts/redeemUniqueAlphaDev.js
//
// deploy to remote test network
// 실행: npx hardhat run scripts/redeemUniqueAlphaDev.js --network <network-name>