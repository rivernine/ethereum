# Unique with Voucher alpha

## 0. 개요
Unique Shared Contract에서 mint 시점에 voucher를 사용한다.

## 1. Work flow
### 1. 데이터를 NFT creator가 개인키를 사용하여 암호화한다.
- Voucher에는 NFT의 모든 정보를 담고 있으며 블록체인에 기록되지 않는 추가정보도 담을 수 있다.
- Voucher는 solidity에서 struct로 정의된다.
```js
struct NFTVoucher {
    uint256 tokenId;
    bytes signature;
}
```
- `tokenId`: 토큰 아이디
- `signature`: creator 서명
### 2. 암호화 되어진 데이터(이하 voucher)는 하나의 NFT와 상쇄(redeem)된다.
Buyer는 `redeem`함수를 호출하여 sigend voucher를 상환한다.
Signed voucher가 유효하고 NFT발행 권한을 가진 계정에 속한경우, 새로운 토큰이 발행된다.

## 2. EIP-712
구조체(`sturct`)데이터의 해싱과 서명을 위한 표준이다.
- Off-chain에서의 서명을 On-chain에서 유용하게 사용할 수 있게 도와준다.

이더리움 서명 알고리즘: `secp256k1`
이더리움 해싱 알고리즘: `keccak256`

## 3. Voucher
`ethers.js`를 이용하여 외부에서 voucher 생성 코드를 작성한다.
- `LazyMinter.js`
```js
const ethers = require('ethers')

const SIGNING_DOMAIN_NAME = "UniqueAlphaDev"
const SIGNING_DOMAIN_VERSION = "1"

class LazyMinter {

  constructor({ contract, signer }) {
    this.contract = contract
    this.signer = signer
  }

  async createVoucher(tokenId) {
    const voucher = { tokenId }
    const domain = await this._signingDomain()
    const types = {
      NFTVoucher: [
        {name: "tokenId", type: "uint256"},
      ]
    }
    const signature = await this.signer._signTypedData(domain, types, voucher)
    return {
      ...voucher,
      signature,
    }
  }

  async _signingDomain() {
    if (this._domain != null) {
      return this._domain
    }
    const chainId = await this.contract.getChainID()
    this._domain = {
      name: SIGNING_DOMAIN_NAME,
      version: SIGNING_DOMAIN_VERSION,
      verifyingContract: this.contract.address,
      chainId,
    }
    return this._domain
  }
}

module.exports = {
  LazyMinter
}
```

- `const SIGNING_DOMAIN_NAME`
  - 서명 도메인 이름
  - **Contract와 동일해야 한다.**
- `const SIGNING_DOMAIN_VERSION`
  - `SIGNING DOMAIN`의 버전
  - 버전이 다른 서명은 호환되지 않는다.
  - **Contract와 동일해야 한다.**

## 3. Smart contract
Voucher를 입력 파라미터로 받아 signer를 확인하고, 검증된 signer일 경우 mint를 해주는 contract를 작성한다.
```sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

contract UniqueAlphaDev is ERC721URIStorage, EIP712, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    string private constant SIGNING_DOMAIN = "UniqueAlphaDev";
    string private constant SIGNATURE_VERSION = "1";

    struct NFTVoucher {
        uint256 tokenId;
        bytes signature;
    }

    constructor(address minter) 
        ERC721("UniqueDev", "UD")
        EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION) {
            _setupRole(MINTER_ROLE, minter);
        }

    /**
    * Redeem
    */
    function redeem(NFTVoucher calldata voucher, string memory tokenURI) public returns (uint256) {
        address signer = _verify(voucher);
        require(hasRole(MINTER_ROLE, signer), "Signature invalid or unauthorized");

        _safeMint(msg.sender, voucher.tokenId);
        _setTokenURI(voucher.tokenId, tokenURI);

        return voucher.tokenId;
    }

    /**
    * Verifies the signature for a given Voucher.
    */
    function _verify(NFTVoucher calldata voucher) internal view returns (address) {
        bytes32 digest = _hash(voucher);
        return ECDSA.recover(digest, voucher.signature);
    }

    /**
    * Returns a hash of the given Voucher
    */
    function _hash(NFTVoucher calldata voucher) internal view returns (bytes32) {
        return _hashTypedDataV4(keccak256(abi.encode(
            keccak256("NFTVoucher(uint256 tokenId)"),
            voucher.tokenId
        )));
    } 

    /**
    * Returns the chain id of the current blockchain.
    */
    function getChainID() external view returns (uint256) {
        uint256 id;
        assembly {
            id := chainid()
        }
        return id;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override (AccessControl, ERC721) returns (bool) {
        return ERC721.supportsInterface(interfaceId) || AccessControl.supportsInterface(interfaceId);
    }
}

```

- `_setupRole(MINTER_ROLE, minter);`
  - mint 권한을 `minter`에게 부여한다.
  - 해당 권한을 가진 주소가 발행한 voucher만 유효하게 된다.

- `function redeem(NFTVoucher calldata voucher, string memory tokenURI)`
  - `voucher`와 토큰을 상쇄하는 함수이다.
- `address signer = _verify(voucher);`
  - `_verify`를 통해 voucher의 signer를 추출한다.  
- `require(hasRole(MINTER_ROLE, signer), "Signature invalid or unauthorized");`
  - voucher signer가 mint 권한을 가지고 있는지 확인한다.

- `function _verify(NFTVoucher calldata voucher)`
  - voucher의 서명을 확인하고 signer 주소를 반환한다.
  - 서명의 유효 여부만을 판단한다.

- `function _hash(NFTVoucher calldata voucher)`
  - voucher의 hash를 반환한다.

- `function getChainID()`
  - 현재 블록체인 네트워크의 chain id를 반환한다.
  - 해당 정보는 voucher를 만들 때 사용한다.
  - 테스트넷에 배포했던 voucher를 메인넷에서 재사용하는 해킹을 방지한다.

## 4. Execute
### 4.0. Compile
```sh
npx hardhat compile
```

### 4.1. Deploy contract
- `deployUniqueAlphaDev.js`
```js
async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const UniqueSample = await ethers.getContractFactory("UniqueAlphaDev");
    const uniqueSample = await UniqueSample.deploy(deployer.address);
  
    console.log("UniqueAlphaDev address:", uniqueSample.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
```
- `await UniqueSample.deploy(deployer.address);`
  - Contract 배포 시점에 MINTER_ROLE에 배포자를 추가한다.
```sh
$ npx hardhat run .\scripts\deployUniqueAlphaDev.js --network <network-name>
Deploying contracts with the account: 0x6A5C5f7964d0cA5a313Bd237ecA6657F52F17810
Account balance: 348363213094858703
UniqueAlphaDev address: 0x5EB8997ee04e5D9b63BCeE48Ba1e10579f02c13F
```

### 4.2. Create voucher
- `createVoucher.js`
```js
const { LazyMinter } = require('./LazyMinter.js')

async function main() {
  const [signer] = await ethers.getSigners();

  console.log("Signer account:", signer.address);
  const UniqueAlphaDev = await ethers.getContractFactory('UniqueAlphaDev')
  const uniqueAlphaDev = await UniqueAlphaDev.attach('0x5EB8997ee04e5D9b63BCeE48Ba1e10579f02c13F')
  const lazyMinter = new LazyMinter({ contract: uniqueAlphaDev, signer: signer })
  const tokenId = 1

  const voucher = await lazyMinter.createVoucher(tokenId)

  console.log("Voucher #" + tokenId)
  console.log(voucher)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```
- `await Unique.attach('0x5EB8997ee04e5D9b63BCeE48Ba1e10579f02c13F')`
  - 4.1. 에서 배포한 contract address를 연결한다.
- `new LazyMinter({ contract, signer })`
  - voucher 생성을 도와줄 객체를 생성한다.
- `const tokenId`
  - voucher를 생성할 토큰의 번호를 입력한다.

```sh
$ npx hardhat run .\scripts\createVoucher.js --network rinkeby 
Voucher #0
{
  tokenId: 0,
  signature: '0x082277701a5bd6c1445e56893c519dc087f01d31c064b36f1e7b014369397d7142dfaed2f1190b54f910279755f670898ea0fef81ceb324273d1a144efb13f181c'
}
```

### 4.3. redeem
- `redeemUniqueAlphaDev.js`
```js
async function main() {
  const [minter, redeemer] = await ethers.getSigners();

  console.log("Minter account:", minter.address);
  console.log("Redeemer account:", redeemer.address);
  console.log("Account balance:", (await minter.getBalance()).toString());

  const UniqueAlphaDev = await ethers.getContractFactory('UniqueAlphaDev')
  const contract = await UniqueAlphaDev.attach('0x5EB8997ee04e5D9b63BCeE48Ba1e10579f02c13F')

  const voucher = {
    tokenId: 0,
    signature: '0x082277701a5bd6c1445e56893c519dc087f01d31c064b36f1e7b014369397d7142dfaed2f1190b54f910279755f670898ea0fef81ceb324273d1a144efb13f181c'
  }
  const uri = 'ipfs://QmVm3Lc4DaGozyiFD5Dj2xKS9p1ZLxD9xETtAVQVV5PTMX'

  console.log(await contract.redeem(voucher, uri))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```
```sh
$ npx hardhat run .\scripts\redeemUniqueAlphaDev.js --network rinkeby

Minter account: 0x6A5C5f7964d0cA5a313Bd237ecA6657F52F17810
Redeemer account: 0x74929CCC46E36F08f8ad848AB5189C3e386A13E0
Account balance: 338759272449473935
{
  hash: '0xe9c2b6c526b8cced645ff2f98cdd3430192ccdd939cb76e09ceb1fa92fdf075d',
  type: 2,
  accessList: [],
  blockHash: null,
  blockNumber: null,
  transactionIndex: null,
  confirmations: 0,
  from: '0x74929CCC46E36F08f8ad848AB5189C3e386A13E0',
  gasPrice: BigNumber { value: "1500000025" },
  maxPriorityFeePerGas: BigNumber { value: "1500000007" },
  maxFeePerGas: BigNumber { value: "1500000025" },
  gasLimit: BigNumber { value: "148347" },
  to: '0x5EB8997ee04e5D9b63BCeE48Ba1e10579f02c13F',
  value: BigNumber { value: "0" },
  nonce: 0,
  data: '0xac47d49000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000041082277701a5bd6c1445e56893c519dc087f01d31c064b36f1e7b014369397d7142dfaed2f1190b54f910279755f670898ea0fef81ceb324273d1a144efb13f181c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035697066733a2f2f516d566d334c63344461476f7a7969464435446a32784b533970315a4c7844397845547441565156563550544d580000000000000000000000',
  r: '0x442f5e3fd3587de5bf6decf3d7ae2a4497711f337094cb38c904534afa78b937',
  s: '0x5c33eee6050a297a38d5de38538b5713e6265d0977607730cac85ba4991dded5',
  v: 0,
  creates: null,
  chainId: 4,
  wait: [Function (anonymous)]
}
```

### 4.4. 결과 확인
- etherscan
  - https://rinkeby.etherscan.io/address/0x5eb8997ee04e5d9b63bcee48ba1e10579f02c13f
- opensea
  - https://testnets.opensea.io/assets/0x5eb8997ee04e5d9b63bcee48ba1e10579f02c13f/0

### 5. 번외
Voucher 서명을 Hacker의 개인키로 서명하는 경우
### 5.1. Create voucher
- `createVoucherFake.js`
```js
const { LazyMinter } = require('./LazyMinter.js')

async function main() {
  const [signer, redeemer, hacker] = await ethers.getSigners();

  console.log("Hacker account:", hacker.address);
  const UniqueAlphaDev = await ethers.getContractFactory('UniqueAlphaDev')
  const uniqueAlphaDev = await UniqueAlphaDev.attach('0x5EB8997ee04e5D9b63BCeE48Ba1e10579f02c13F')
  const lazyMinter = new LazyMinter({ contract: uniqueAlphaDev, signer: hacker })
  const tokenId = 1

  const voucher = await lazyMinter.createVoucher(tokenId)

  console.log("Voucher #" + tokenId)
  console.log(voucher)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

```sh
$ npx hardhat run .\scripts\createVoucherFake.js --network rinkeby 

Voucher #1
{
  tokenId: 1,
  signature: '0x6052cdfed5ded8f8c3be7afe8c32771317aea6f12dc7ac2c49977fd7711c833c4bcc471e53966c3ecba7f27b7b55dbec87d3c32f20a40495515d8c7f3839c72f1c'
}
```

### 5.2. Redeem
- 해커가 발급한 voucher를 사용하여 redeem
```sh
$ npx hardhat run .\scripts\redeemUniqueAlphaDev.js --network rinkeby
{
  reason: 'cannot estimate gas; transaction may fail or may require manual gas limit',
  code: 'UNPREDICTABLE_GAS_LIMIT',
  error: ProviderError: execution reverted: Signature invalid or unauthorized
}
```
- `Signature invalid or unauthorized`
  - Hacker의 주소는 컨트랙트 배포 시 MINTER_ROLE에 등록되지 않았으므로 오류가 발생한다.
  - Solidity 코드의 `require(hasRole(MINTER_ROLE, signer), "Signature invalid or unauthorized");`를 통과하지 못한다.