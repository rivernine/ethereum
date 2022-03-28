# Generative alpha

## 경우의 수
1. reveal X, batch mint X
  - 토큰 별 고유한 URI가 필요하다.
2. reveal X, batch mint O
  - 토큰 별 고유한 URI가 필요하다.
  - 하나의 트랜잭션으로 여러 번의 mint를 진행해야한다.
3. reveal O, batch mint X
  - 토큰 별 고유한 URI가 필요하다.
  - baseURI를 변경하는 로직이 필요하다.
4. reveal O, batch mint O
  - 토큰 별 고유한 URI가 필요하다.
  - baseURI를 변경하는 로직이 필요하다.
  - 하나의 트랜잭션으로 여러 번의 mint를 진행해야한다.

### 0. 필수 조건
- tokenId를 통해 메타데이터 uri를 유추할 수 없어야 한다.
  - 메타데이터 파일 명은 tokenId와는 상관없는 난수로 한다.

### 1. reveal X, batch mint X
1. 메타데이터의 파일 명을 난수로하여 준비한다.
2. tokenId와 일대일매핑되는 파일 명을 DB로 관리한다.
3. tokenId와 uri를 voucher에 담아 생성한다.
4. mint(voucher)

### 2. reveal X, batch mint O
batch mint 기능을 사용하려면 여러개의 voucher가 필요하다.
1. 메타데이터의 파일 명을 난수로하여 준비한다.
2. tokenId와 일대일매핑되는 파일 명을 DB로 관리한다.
3. 입력한 민팅 수량만큼 tokenId와 uri를 voucher에 담아 생성한다.
4. mint(voucher[])

### 3. reveal O, batch mint X
reveal 기능을 사용하려면 메타데이터의 조건은 다음과 같다.
- reveal 전과 후의 메타데이터 파일 명은 같아야한다.
- 메타데이터 파일 명은 tokenId와는 상관없는 난수로 한다.
1. 메타데이터의 파일 명을 난수로하여 준비한다.
2. tokenId와 일대일매핑되는 파일 명을 DB로 관리한다.
3. tokenId와 reveal 전의 uri를 voucher에 담아 생성한다.
4. mint(voucher)
5. reveal 시점에 baseuri를 변경한다.

### 4. reveal O, batch mint O
1. 메타데이터의 파일 명을 난수로하여 준비한다.
2. tokenId와 일대일매핑되는 파일 명을 DB로 관리한다.
3. 입력한 민팅 수량만큼 tokenId와 reveal 전의 uri를 voucher에 담아 생성한다.
4. mint(voucher)
5. reveal 시점에 baseuri를 변경한다.