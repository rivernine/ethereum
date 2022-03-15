async function main() {
    const [deployer, _] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const UniqueSample = await ethers.getContractFactory("UniqueSample");
    const uniqueSample = await UniqueSample.deploy();
  
    console.log("UniqueSample address:", uniqueSample.address);
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