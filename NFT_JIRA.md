# NFT_JIRA
## 표준 및 구현체
### 표준
NFT에 대한 관심과 활용도가 높아져 이더리움재단에서 ERC-20 토큰 외 NFT 표준을 만들었다.
- ERC-721
  - NFT의 표준으로 유니크한 속성을 가진 토큰을 정의하고 토큰 타입(e.g. Cryptopunkgs)의 토큰이 1개 또는 여러개인 collection 형태(e.g.Cryptopunks #1, #2, ...)로 발행할 수 있다.
- ERC-1155
  - 멀티 토큰의 표준으로 하나의 스마트 컨트랙트 내에서 다수의 ERC-20, ERC-721 토큰을 정의하고 발행할 수 있다.
### 구현체
`Openzeppelin`의 구현체가 사실상 표준으로 활용된다.
> Opensea whitelisting은 Opensea에서 만든 컨트랙트로 Openzeppelin을 상속받아 Opensea에서 바로 거래 가능한 컨트랙트를 제공한다,
* ERC-721
  - 개요
    - Non-Fungible Token Standard
    - 유니크한 속성을 가진 token type을 1개 또는 collection으로 정의 가능하다.
  - 인터페이스(구현 필수)
    - ERC-721 Spec상에 있는 functions를 구현해야 한다.
      - `ownerOf, balanceOf, transfer, approve` 등
    - ERC-721 Spec상에 있는 event를 구현해야 한다.
      - `Transfer, Approval` 등
  - 선택적 인터페이스(옵션)
    - Metadata extension
      - Metadata spec으로 NFT의 `name, symbol, tokenUri function`을 구현할 수 있다.
      - Optional이나 대부분의 NFT는 해당 extension을 사용한다.
    - Collection extension
      - 하나의 Collection으로 이루어진 NFT들을 만들고 조회할 때 필요한 Spec
      - `totalSupply, tokenByIndex, tokenOfOwnerByIndex function`을 구현할 수 있다.
  - Openzeppelin Custom 구현체(ERC에서 정의한 인터페이스 외 추가 기능을 구현한 extension)
    - ERC721Mintable
      - 토큰을 새로 mint할 수 있는 권한을 가진 account를 추가할 수 있는 기능
    - ERC721MetadataMintable
      - metadata extension이 추가된 mintable
    - ERC721Burnable
      - token을 burn 할 수 있는 기능
    - ERC721Pausable
      - 거래를 일시정지 할 수 있는 기능
  - Openzeppelin Preset
    - openzeppelin에서 기본 인터페이스 구현체와 custon으로 구현한 기능들을 모두 포함한 구현체
* ERC-1155
  - 개요
    - Multi-Token Standard
    - 하나의 컨트랙트에서 ERC-20 및 721 token type을 여러개 정의할 수 있다.
    - 여러개 토큰을 동시에 transfer하여 tx fee를 줄일 수 잇다.
  - 인터페이스(구현 필수)
    - ERC-1155 Spec상에 있는 functions을 구현해야 한다.
      - `ownerOf, balanceOfBatch, transferSingle/Batch, approve` 등
    - ERC-1155 Spec상에 있는 event을 구현해야 한다.
      - `Transfer, Approval` 등
    - ERC-721과의 차이는 컨트랙트 내 여러 자산이 들어갈 수 있으므로 모든 자산에대한 잔액이나 이동을 지원(batch)
  - 선택적 인터페이스(옵션)
    - Metadata extension
      - Metadata spec으로 uri function을 구현할 수 있다.
      - ERC-721과는 달리 name, symbol function은 없으며 name, symbol은 metadata scheme와 중복될 수 있으므로 생략됨.
  - OpenZeppelin Custom 구현체
    - ERC1155Burnable
    - ERC1155Pausable