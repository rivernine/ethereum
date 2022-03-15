require("@nomiclabs/hardhat-waffle");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const ROPSTEN_PRIVATE_KEY_1 = "3b4f3354be4e4f30afd51f1a72ee85927810f9a6849e3045daf68252c912cebd"; // 0x6A5C5f7964d0cA5a313Bd237ecA6657F52F17810
const ROPSTEN_PRIVATE_KEY_2 = "f392f1e76d5730d562c984da4b45d7f37f62cfc7dc54fdb95d71c239bf39f8e7"; // 0x74929CCC46E36F08f8ad848AB5189C3e386A13E0
const ROPSTEN_PRIVATE_KEY_3 = "7b15ea586027b027d46bcfa0a8527adaa976b1688df3ffda70e1b9bee3208cb1"; // 0x2befD7D81039ba98b90c719A28E3e80Fe2Cf900E

module.exports = {
  solidity: "0.8.9",
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/5dd62c74a8cb45c1926f431dacf8266a",
      accounts: [`${ROPSTEN_PRIVATE_KEY_1}`, `${ROPSTEN_PRIVATE_KEY_2}`, `${ROPSTEN_PRIVATE_KEY_3}`]
    }
  }
};
