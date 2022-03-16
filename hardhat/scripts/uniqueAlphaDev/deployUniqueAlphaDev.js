async function main() {
    const [deployer, _] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const UniqueAlphaDev = await ethers.getContractFactory("UniqueAlphaDev");
    const uniqueAlphaDev = await UniqueAlphaDev.deploy(deployer.address);
  
    console.log("UniqueAlphaDev address:", uniqueAlphaDev.address);
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