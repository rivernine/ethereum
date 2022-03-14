# Unique with Voucher

## 0. 개요
Unique Shared Contract에서 mint 시점에 voucher를 사용한다.

## 1. Work flow
### 1. 데이터를 NFT creator가 개인키를 사용하여 암호화한다.
- Voucher에는 NFT의 모든 정보를 담고 있으며 블록체인에 기록되지 않는 추가정보도 담을 수 있다.
- Voucher는 solidity에서 struct로 정의된다.
```js
struct NFTVoucher {
    uint256 tokenId;
    uint256 minPrice;
    bytes signature;
}
```
- `tokenId`: 토큰 아이디
- `uri`: 토큰의 메타데이터
- `signature`: creator 서명
### 2. 암호화 되어진 데이터(이하 voucher)는 하나의 NFT와 상쇄(redeem)된다.
Buyer는 `redeem`함수를 호출하여 sigend voucher를 상환한다.
Signed voucher가 유효하고 NFT발행 권한을 가진 계정에 속한경우, 새로운 토큰이 발행된다.

