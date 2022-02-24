# Petshop
## Truffle
Ethereum Dapp 개발 프레임워크로 다음과 같은 기능을 제공한다.
- Solidity 개발/테스트/배포
- Web3.js 라이브러리 통합
- Node.js application 개발/구동
- Petshop App 개발/구동

## Ganache
Ethereum 개발용 personal blockchain.
- Ethereumjs 기반 testRPC
- 개발을 위한 블록생성
- Transaction/gas 및 Ether mining
- Ganache-cli 지원

## Metamask
Chrome plugin 기반 개인 지갑

## Petshop
이더리움을 익히는데에 좋은 튜토리얼
### 1. 개발환경구성
#### 1.1. Truffle 설치
```sh
$ sudo npm install -g truffle
```
#### 1.2. Ganache 설치
https://trufflesuite.com/ganache/ 에서 Ganache 다운로드

#### 1.3. Truffle unbox
원하는 위치에 truffle project `petshop`을 위치시킨다.
```sh
$ truffle unbox pet-shop
```
`truffle unbox`를 실행하면 폴더와 파일들이 생성된다.
- `contracts/`
  - Solidity source file
- `migrations/`
  - Truffle에서 스마트 컨트랙트 배포를 위한 시스템.
  - 스마트컨트랙트의 변경사항을 추적가능하다.
- `test/`
  - 스마트컨트랙트의 js 및 solidity test
- `truffle-config.js`
  - truffle 설정파일

### 2. 스마트 컨트랙트 작성
`/contracts/Adoption.sol`생성
```js
pragma solidity ^0.5.0;

contract Adoption {
  address[16] public adopters;

  // Adopting a pet
  function adopt(uint petId) public returns (uint) {
    require(petId >= 0 && petId <= 15);

    adopters[petId] = msg.sender;

    return petId;
  }

  // Retrieving the adopters
  function getAdopters() public view returns (address[16] memory) {
    return adopters;
  }
}

```
- `pragma solidity ^0.5.0;`
  - Solidity의 최소 버전
  - 컴파일러의 버전이 0.5.0 이상
- `view`
  - view로 선언되어진 함수는 상태를 수정하지 않는다.

### 3. Compile
EVN(Ethereum Virtual Machine)에서 실행하려면 Solidity를 바이트코드로 컴파일해야한다.
Truffle을 이용하여 컴파일하면 해당 결과가 `build/contracts/`에 json형태로 저장된다.
```sh
$ truffle compile
```

### 4. Migration
컴파일된 컨트랙트를 블록체인에 마이그레이션한다.
마이그레이션은 배포스크립트로 app의 컨트랙트의 상태를 변경한다.
첫번째 마이그레이션은 배포, 그 후 다른 마이그레이션은 데이터의 변경이나 이동이다.

- `migrations/1_initial_migration.js`
  - `Migrations.sol`컨트랙트를 배포한다.
  - 중복 마이그레이션을 방지하기도 한다.

#### 4.1. Migration 컨트랙트 작성
`migrations/2_deploy_contracts.js` 생성
- `2_deploy_contracts.js`
```js
var Adoption = artifacts.require("Adoption");

module.exports = function(deployer) {
  deployer.deploy(Adoption);
};
```

#### 4.2. Migration
작성한 컨트랙트를 마이그레이션하려면 블록체인이 구동 중 이여야 한다.
이 튜토리얼에서는 Ganache(Personal blockchain)를 이용할 것이다.
Ganache는 7545포트에서 실행된다.

### 5. Test
`test/TestAdoption.sol` 생성

#### 5.1. `TestAdoption.sol`
- `TestAdoption.sol`
```js
pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
  // The address of the adoption contract to be tested
  Adoption adoption = Adoption(DeployedAddresses.Adoption());

  // The id of the pet that will be used for testing
  uint expectedPetId = 8;

  // The expected owner of adopted pet is this contract
  address expectedAdopter = address(this);

}
```
- `import "truffle/Assert.sol";`
  - 테스트에서 pass/faile을 리턴하기위해 equality, inequality, emptiness등을 확인한다.
- `import "truffle/DeployedAddresses.sol";`
  - 테스트를 실행할 때, truffle은 새로운 컨트랙트를 블록체인에 배포한다.
  - 위의 스마트컨트랙트는 배포된 컨트랙트의 주소를 가져온다.
- `import "../contracts/Adoption.sol";`
  - 테스트를 하기위한 스마트컨트랙트
  
- `uint expectedPetId = 8;`
  - 테스트에 사용용할 pet id
- 'address expectedAdopter = address(this);'
  - `TestAdoption`컨트랙트가 트랜잭션을 보낼것이므로 expectedAdopter을 현재 address로 설정한다.

#### 5.2. `adopt()` 테스팅
adopt() 함수를 테스트하는 함수이다.
```js
function testUserCanAdoptPet() public {
  uint returnedId = adoption.adopt(expectedPetId);

  Assert.equal(returnedId, expectedPetId, "Adoption of the expected pet should match what is returned.");
}
```

#### 5.3. get single pet's owner
petid를 통해 adopter address를 가져올 수 있다.
*public variable에는 getter method가 자동으로 생성된다*
```js
function testGetAdopterAddressByPetId() public {
  address adopter = adoption.adopters(expectedPetId);

  Assert.equal(adopter, expectedAdopter, "Owner of the expected pet should be this contract");
}
```

#### 5.4. get all pet owners
```js
function testGetAdopterAddressByPetIdInArray() public {
  address[16] memory adopters = adoption.getAdopters();

  Assert.equal(adopters[expectedPetId], expectedAdopter, "Owner of the expected pet should be this contract");
}

```

#### 5.5. 전체 코드
- `TestAdoption.sol`
```js
pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
  Adoption adoption = Adoption(DeployedAddresses.Adoption());
  uint expectedPetId = 8;
  address expectedAdopter = address(this);

  function testUserCanAdoptPet() public {
    uint returnedId = adoption.adopt(expectedPetId);

    Assert.equal(returnedId, expectedPetId, "Adoption of the expected pet should match what is returned.");
  }
 
  function testGetAdopterAddressByPetId() public {
    address adopter = adoption.adopters(expectedPetId);

    Assert.equal(adopter, expectedAdopter, "Owner of the expected pet should be this contract");
  }

  function testGetAdopterAddressByPetIdInArray() public {
    address[16] memory adopters = adoption.getAdopters();

    Assert.equal(adopters[expectedPetId], expectedAdopter, "Owner of the expected pet should be this contract");
  }
}
```

#### 5.6. 테스트 실행 및 결과
```sh
$ truffle test
Using network 'development'.

Compiling your contracts...
===========================
> Compiling ./test/TestAdoption.sol
> Artifacts written to /tmp/test--7035-qeDmKNcvgvUp
> Compiled successfully using:
   - solc: 0.5.16+commit.9c3226ce.Emscripten.clang

  TestAdoption
    ✓ testUserCanAdoptPet (539ms)
    ✓ testGetAdopterAddressByPetId (355ms)
    ✓ testGetAdopterAddressByPetIdInArray (485ms)

  3 passing (17s)
```