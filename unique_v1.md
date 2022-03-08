# unique (v1. public only)

## 0. Infura
|Key|Value|
|:-:|:-:|
|Project ID|5dd62c74a8cb45c1926f431dacf8266a|
|Project Secret|1d2b792d2bfb4fba80991e3d3f016400|
|Endpoint|Ropsten|
|Endpoint https|https://ropsten.infura.io/v3/5dd62c74a8cb45c1926f431dacf8266a|
|Endpoint ws|wss://ropsten.infura.io/ws/v3/5dd62c74a8cb45c1926f431dacf8266a|

## 1. Workflow
1. Shared contract 배포 (ERC-721)
2. Creator가 offchain에 메타데이터 업로드 후 URI 정보 획득
3. Creator가 mint함수 호출 (owner: creator) 

## 2. Test