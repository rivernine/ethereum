async function main() {
  const [accessor] = await ethers.getSigners();

  console.log("Accessor account:", accessor.address);
  console.log("Account balance:", (await accessor.getBalance()).toString());

  const UniqueAlphaDevV2 = await ethers.getContractFactory('UniqueAlphaDevV2')
  const uniqueAlphaDevV2 = await UniqueAlphaDevV2.attach('0x236F20c038eB2803AA4536675162F992aC002E42')

  console.log(await uniqueAlphaDevV2.MINTER_ROLE())
  // console.log(await uniqueAlphaDevV2._tokenIds.current())
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