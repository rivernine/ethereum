async function main() {
  const [minter, redeemer] = await ethers.getSigners();

  console.log("Minter account:", minter.address);
  console.log("Redeemer account:", redeemer.address);
  console.log("Account balance:", (await minter.getBalance()).toString());

  const UniqueAlphaDev = await ethers.getContractFactory('UniqueAlphaDev')
  const uniqueAlphaDev = await UniqueAlphaDev.attach('0x5EB8997ee04e5D9b63BCeE48Ba1e10579f02c13F')

  const voucher = {
    tokenId: 1,
    signature: '0x6052cdfed5ded8f8c3be7afe8c32771317aea6f12dc7ac2c49977fd7711c833c4bcc471e53966c3ecba7f27b7b55dbec87d3c32f20a40495515d8c7f3839c72f1c'
  }
  const uri = 'ipfs://QmX6j8B15ad31Zbwv73WpZwUfSV79rzbvUcjEkxQb2Wvhe'

  console.log(await uniqueAlphaDev.connect(redeemer).redeem(voucher, uri))
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