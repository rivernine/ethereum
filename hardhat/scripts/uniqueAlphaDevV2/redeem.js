async function main() {
  const [minter, redeemer] = await ethers.getSigners();

  console.log("Redeemer account:", redeemer.address);
  console.log("Account balance:", (await redeemer.getBalance()).toString());

  const UniqueAlphaDevV2 = await ethers.getContractFactory('UniqueAlphaDevV2')
  const uniqueAlphaDevV2 = await UniqueAlphaDevV2.attach('0x236F20c038eB2803AA4536675162F992aC002E42')

  const voucher = {
    uri: 'ipfs://QmX6j8B15ad31Zbwv73WpZwUfSV79rzbvUcjEkxQb2Wvhe',
    signature: '0x6f950b1cf7215e3755dd03da79f428bbd485851804f3dd091ed7d29b1dca28c44d6b7bd842738af36802e8f2b9896033262ec3f0169227e59198e185fe9c483a1c'
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