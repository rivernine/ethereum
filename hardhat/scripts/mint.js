async function main() {
    const [minter] = await ethers.getSigners();
  
    console.log("Minter account:", minter.address);
    console.log("Account balance:", (await minter.getBalance()).toString());
  
    const Unique = await ethers.getContractFactory('UniqueSample')
    const contract = await Unique.attach('0x13efF1702972b33bf7e839481Ad540B521f94601')

    const voucher = {
      tokenId: 3,
      signature: '0x7bf67ade7b950b24460397b32d5256f37bcbd78d3cbff9da9a9f54dbfe174cd2636f76670ab35d4bec4fcb280834a9d0e3c91c574183505abee62bc6e8cae5681c'
    }
    const uri = 'ipfs://QmSEpyKQXTamAWVncVbu8D3Ph5Wmzormv54hZqDbvxguUq'

    console.log(await contract.redeem(voucher, uri))
    // console.log(await contract.mint(uri))
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });

// deploy to hardhat virtual network 
// 실행: npx hardhat run scripts/mint.js
// 
// deploy to remote test network
// 실행: npx hardhat run scripts/mint.js --network <network-name>