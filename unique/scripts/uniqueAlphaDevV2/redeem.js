async function main() {
  const [minter, redeemer] = await ethers.getSigners();

  console.log("Redeemer account:", redeemer.address);
  console.log("Account balance:", (await redeemer.getBalance()).toString());

  const factory = await ethers.getContractFactory('GenerativeAlphaDev')
  const contract = await factory.attach('0x0B7A00501586085e4De8E83507667559A5F4B4AB')

  const voucher = {tokenId:1,tokenURI:"32219ca53a",signature:"0xfcdb970bb2963cdc5e8fca4a43fd6e993f7c7b84b50f613f046c3c88f87e80323e92872d2f0f5d4d31d1699893e3eec3f19f798c260fd262528d4a5c47b8cc1d1c"}
  const options = {value: ethers.utils.parseEther("0.005")}
  console.log(await contract.connect(redeemer).redeem(voucher, options))
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
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