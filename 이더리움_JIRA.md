# 이더리움 JIRA
## 트랜잭션
### 트랜잭션 정보
- from
  - 트랜잭션 송신자의 address
  - 직접 개인키로 서명한 트랜잭션(raw transaction)의 경우 설정하지 않아도 된다.
- nonce
  - 트랜잭션 송신자에 의해 보내진 트랜잭션의 개수
- gasPrice
  - 트랜잭션에 대해 송신자가 지불할 의사가 있는 gas 수량
- gasLimit
  - 트랜잭션에 대해 송신자가 최대로 지불할 수 있는 gas 수량
  - 트랜잭션 실행 후 남은 gas는 송신자의 account로 전송된다.
- to
  - 트랜잭션 수신자의 address
  - 스마트 컨트랙트 실행 시: contract address
  - 스마트 컨트랙트 배포 시: null
- value
  - 전송되는 ether의 양
  - 스마트 컨트랙트 실행 시: 0
  - 스마트 컨트랙트 배포 시: 배포되어지는 CA의 초기 잔액
- data
  - 컨트랙트 호출 시 입력 데이터(argu)

### 트랜잭션 전송
* Transaction
  - 지갑이나 계정관리 툴에 account를 등록 후 트랜잭션 정보를 전달하면, 해당 지갑에서 
    서명을 하고 노드에 트랜잭션을 전송한다.
  - API
    - `web3.eth.sendTransaction`
* Raw Transaction
  - 개인키를 별도로 관리할 경우 직접 개인키로 서명한 후 노드로 전송한다.
  - 보안을 위해 client 외부에서 생성할 때 도움이 된다.
  - API
    - `web3.eth.sendSignedTransaction

### 트랜잭션 결과
트랜잭션이 블록에 반영되면 `transaction receipt`가 생성되고, 트랜잭션 실행 결과를 알수있다.
Receipt에는 다음과 같은 정보가 포함되어있다.
- transactionHash
  - 해당 트랜잭션의 hash
- transactionIndex
  - 포함되어 있는 블록에서의 index
- blockHash
  - 블록의 hash
- blockNumber
  - 블록의 번호
- from
  - 트랜잭션 송신자의 address
- to
  - 트랜잭션 수신자의 address
- gasUsed
  - 사용된 gas량
- cumulativeGasUsed
  - 블록 내 이전 트랜잭션들의 gasUsed의 합
- contractAddress
  - 스마트 컨트랙트 배포 시, 생성된 컨트랙트의 address
  - 그 외의 트랜잭션의 경우 null
- logs
  - 해당 트랜잭션이 생성한 로그 객체의 배열
- status
  - 1/0 (success/failure)

### 트랜잭션 플로우
#### 사용자 관점
1. 트랜잭션 생성
  - 트랜잭션 데이터를 생성하고 개인키로 서명한다.
2. 트랜잭션 전송
  - 서명되어진 트랜잭션을 이더리움 노드에 전송하면, 이더리움 노드는 트랜잭션 id를 리턴한다.
3. 트랜잭션 상태변경
  - 이더리움 노드에 수신된 트랜잭션은 블록에 반영될 때까지 pending상태가 된다.
4. 트랜잭션 receipt 조회
  - 트랜잭션 receipt조회 시 pending상태면 null을 리턴, commit되면 실행 결과를 확인할 수 있다.

#### 네트워크 관점
1. 트랜잭션 요청
  - 사용자가 개인키로 서명한 트랜잭션을 이더리움 네트워크 참여 노드에게 전송한다.
2. 트랜잭션 검증 및 전파
  - 트랜잭션을 수신한 노드는 트랜잭션을 검증하고 자신과 연결되어 있는 peer에게 전송한다.
  - 다른 peer역시 동일 방법으로 전송하여 네트워크에 트랜잭션이 전파된다.
  - 모든 노드는 수신한 트랜잭션이 실제 해당 account로 서명되었는지 검증한 후 자신의 트랜잭션 풀에 저장한다.
  - (모든 트랜잭션을 저장되는 것은 아니며 노드의 설정에 따라 무시될 수 있다.)
3. 블록 생성
  - 블록 생성 시점에 도달하면 채굴노드는 gas limit 이하에서 트랜잭션 fee를 최대로 할 수 있는 트랜잭션들을 자신의 트랜잭션 풀에서 선택하고 블록으로 생성한다.
  - 이 때, 블록의 트랜잭션들에 대해 다음 과정을 수행한다.
  - 트랜잭션 유효성 검증 -> 트랜잭션 코드 실행 -> local EVN의 state 반영 -> 각 트랜잭션 fee를 자신의 account에게 지급
  - 트랜잭션 실행 시 parent의 world state를 복제하여 사용하고, 모든 트랜잭션을 실행한 후 state/transactinon/receipt의 root hash를 block header에 반영한다.
  - 블록의 모든 트랜잭션 검증과 실행을 마치면 작업 증명을 생성한다.
4. 블록 전파
  - 채굴자는 완료된 블록을 자신에게 반영하고 다른 노드들에게 전달한다.
5. 블록 수신 및 반영
  - 블록을 수신한 노드는 다음과 같은 절차를 통해 블록을 검증하고 원장에 반영한다.
  - 작업 증명 검증 -> 블록 내 모든 트랜잭션 실행 및 receipt 생성 -> 새로은 local EVM state의 checksum과 블록의 checksum 비교 -> 블록체인에 블록 추가 -> 새 EVN state 반영
6. 트랜잭션 풀 업데이트
  - 각 노드는 새 블록 내의 모든 트랜잭션을 자신의 트랜잭션풀에서 삭제한다.

### 상태전이함수(`APPLY(S, TX) -> S'`)
이더리움의 모든 트랜잭션에 대하여 상태전이함수를 실행한다.
1. 트랜잭션 형식, 서명, nonce의 유효성을 확인한다.(유효하지 않으면 에러를 리턴한다.)
2. 송신자의 계정에서 Trasaction fee를 차감한 후 nonce를 증가시킨다.(잔액이 부족하면 에러를 리턴한다.)
3. 바이트 당 일정량의 gas를 제거한다.
4. 트랜잭션 내용에 따라 Ether전송을 실행하거나 컨트랙트가 완료될 떄 까지, 또는 gas가 다 떨어질 때 까지 실행한다.
5. 송신자의 잔액이 부족하거나 컨트랙트 실행에 gas가 부족한 경우 Transactino fee 지불을 제외한 모든 상태를 되돌린다.
6. 실행이 성공한 경우, 남은 gas는 송신자에게 환불되고 소비한 gas는 miner에게 보낸다.

### 트랜잭션 풀(mempool)
각 노드의 메모리에 블록으로 기록되지 않은 트랜잭션(pending transaction)을 저장하는 대기열이다.
- Geth: Transaction pool
- Parity: Transaction queue
노드별로 각자의 mempool을 보유하고 있고 서로 다른 정보를 가지고 있을 수 있다.
노드에서 pool크기, gas price제한, 유지시간 등을 설정할 수 있다.