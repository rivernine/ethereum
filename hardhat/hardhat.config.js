require("@nomiclabs/hardhat-waffle");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const ROPSTEN_PRIVATE_KEY = "3b4f3354be4e4f30afd51f1a72ee85927810f9a6849e3045daf68252c912cebd";

module.exports = {
  solidity: "0.8.9",
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/5dd62c74a8cb45c1926f431dacf8266a",
      accounts: [`${ROPSTEN_PRIVATE_KEY}`]
    }
  }
};
