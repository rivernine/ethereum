async function main() {
  const [deployer, _] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const UniqueAlphaDevV2 = await ethers.getContractFactory("UniqueAlphaDevV2");
  const uniqueAlphaDevV2 = await UniqueAlphaDevV2.deploy(deployer.address);

  console.log("UniqueAlphaDevV2 address:", uniqueAlphaDevV2.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// deploy to hardhat virtual network
// 실행: npx hardhat run scripts/deploy.js
//
// deploy to remote test network
// 실행: npx hardhat run scripts/deploy.js --network <network-name>