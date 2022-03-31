# How To Compile

## 0. Hardhat

### 0.0. Install
```sh
$ npm install hardhat
$ npm install @nomiclabs/hardhat-waffle
$ npm install @openzeppelin/contracts
```

### 0.1. Compiler version
compiler 버전 변경 시 `hardhat.config.js` 수정

## 1. Contract 생성
`hardhat/contracts/` 내부에 컨트랙트 생성
e.g. `hardhat/contracts/GenerativeAlphaDev.sol`

## 2. Compile
```sh
$ cd hardhat
$ npx hardhat compile

Compiled 16 Solidity files successfully
```

## 3. Check output
`hardhat/artifacts` 에 컴파일의 결과를 확인할 수 있음

배포에는 `abi, bytecode`가 필요하다.

## 4. Deploy
Application에 abi와 bytecode를 전달하고, 메타마스크 서명을 통해 deploy