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

## 1. 메타데이터 준비
1. hashlips를 이용하여 image, metadata, mappingdata 생성
2. image를 IPFS에 업로드
3. metadata 수정 후 IPFS에 업로드

### 1.1. Hashlips
Hashlips을 이용하여 random image, metadata json을 생성한다.
파일명을 `sha1(prefix + tokenId)`로 해쉬하여 난수화하였다.
또한 tokenId와 매핑되는 파일 명들의 정보를 별도로 저장하였다.

- `mappingData.json`
```json
{
    "1": "32219ca53a",
    "2": "b757255117",
    "3": "9dc3ce44b9",
    "4": "c870c1291f",
    "5": "c4594473bb",
    "6": "f11c6e7db8",
    "7": "e11c09630d",
    "8": "6d073f0fa2",
    "9": "379791bb6d",
    "10": "c04507c476",
    "11": "9c65ca72a1",
    "12": "975e93b4f8",
    "13": "f9bac46f24",
    "14": "dd93e86786",
    "15": "e583f6e911",
    "16": "344c659042",
    "17": "d3a703c92c",
    "18": "02ab08cde6",
    "19": "c7e2d0588e",
    "20": "7110111943"
}
```

### 1.2. Image를 IPFS에 업로드
- 이미지 업로드 결과
  - image baseURI: `ipfs://QmXapx92HYCLkEW8L6WVgPuJQkMBKAzyEbYfPLVYfBL6Ej/`
```json
{
    "Name": "02ab08cde6.png",
    "Hash": "QmbUn3WbydDNP5ss59s5Hirj9ANRd2kjnH19ALNbayKgTJ",
    "Size": "223666"
}
{
    "Name": "6d073f0fa2.png",
    "Hash": "QmTT5Gp5WkUL77eaU2Tk71MKugjha1Bdc3f8EEb1fN7HA1",
    "Size": "207171"
}
{
    "Name": "9c65ca72a1.png",
    "Hash": "Qmao2kFXXuECHxLCfXa4y1ydVt3hrRP1jWwH51BgU2QpNt",
    "Size": "212756"
}
{
    "Name": "9dc3ce44b9.png",
    "Hash": "QmSVphgoWmTePNJq2nEGAbx2NmeSHMd8kc2FVZRVbdRcrT",
    "Size": "215007"
}
{
    "Name": "344c659042.png",
    "Hash": "QmfJGfLy6LwmkAQFfntvnZoQGi72HQLhzo1sM5xNiEWcLC",
    "Size": "213030"
}
{
    "Name": "975e93b4f8.png",
    "Hash": "QmRt3Rd4FjzsnAw1ukNe1xUNZbVtSedcyxK7DGooo8J3km",
    "Size": "207221"
}
{
    "Name": "32219ca53a.png",
    "Hash": "QmadEW5kDukKEWv1oVuBsDkZatvAaDzAH6DmoPKmQQmPuW",
    "Size": "223442"
}
{
    "Name": "379791bb6d.png",
    "Hash": "QmXtkvriFQuZHMswdCCkatNmz1woKR5ViW4oNhKETj5XN1",
    "Size": "192015"
}
{
    "Name": "7110111943.png",
    "Hash": "QmP5tTE6HG3Noypn3H6ZrspMWENYTcjisfXH5ix8DMwFg6",
    "Size": "225353"
}
{
    "Name": "b757255117.png",
    "Hash": "QmR8wHcyHNyh34tkAUcW2pCczjmX8UFMHi8yf7gXbD91uQ",
    "Size": "213370"
}
{
    "Name": "c7e2d0588e.png",
    "Hash": "QmX4ez89Q39MTG8jtDfPtUxrrX9MgY17Hj8f4cN9Qe37x7",
    "Size": "230221"
}
{
    "Name": "c870c1291f.png",
    "Hash": "QmTnTdWZZsay5yaXmxTFsRL1TKDmx6hAWzPua6BKJbE6Si",
    "Size": "199059"
}
{
    "Name": "c04507c476.png",
    "Hash": "QmVVQfgggha37KoCmRquDTdKzL1h5TKibAkKt7bsG1zykV",
    "Size": "188158"
}
{
    "Name": "c4594473bb.png",
    "Hash": "QmcXm1UJ7bct7b1Uf8mc42o3za8XFyswFYBjx4fdkhRWsf",
    "Size": "224673"
}
{
    "Name": "d3a703c92c.png",
    "Hash": "QmYnsm3jczrXJiLzCc9JCqV5836VN5ZpHqvfjmeEsxYY8C",
    "Size": "193090"
}
{
    "Name": "dd93e86786.png",
    "Hash": "Qmbg25nDKGK39JzQ8zeniLaXUWbi8PU25TLKL8R8F884td",
    "Size": "211777"
}
{
    "Name": "e11c09630d.png",
    "Hash": "QmVidFJpzYL72CCp661LMRurbik1TDfedLaPWLm2KkJUCC",
    "Size": "203452"
}
{
    "Name": "e583f6e911.png",
    "Hash": "QmRV7MoS4wgfQDvGTrkG64pFcoAuevF7MNJxENDyPWWMNH",
    "Size": "225209"
}
{
    "Name": "f9bac46f24.png",
    "Hash": "QmZ5eV7mw9QYJPbDTZoEDipzVQRcF2UEQ27iHBz9gV5hgZ",
    "Size": "218310"
}
{
    "Name": "f11c6e7db8.png",
    "Hash": "QmdxRVS6wumVQZsVWZrtXRkGLE2yx95KtVCVb43rsmSRbb",
    "Size": "197765"
}
{
    "Name": "",
    "Hash": "QmXapx92HYCLkEW8L6WVgPuJQkMBKAzyEbYfPLVYfBL6Ej",
    "Size": "4225909"
}
```

### 1.3. Metadata 수정 후 IPFS에 업로드
- 메타데이터 업로드 결과
  - metadata baseURI: `ipfs://QmQbRroNMsDZuYEG3w6ZfJa8PA8EpaQdAJVMZ8MMZQFXWs/`
```json
{
    "Name": "02ab08cde6.json",
    "Hash": "QmbuZiN2Ba3JsM23J47iAmNhBx2c3TKkyZS9dvCW2MwVVm",
    "Size": "817"
}
{
    "Name": "6d073f0fa2.json",
    "Hash": "QmVeyHNbTTv9HYTACiE5k9yquJrxiEeuVPzNiMBRzgazgp",
    "Size": "819"
}
{
    "Name": "9c65ca72a1.json",
    "Hash": "QmXDR97VXzPZobos8wkAZ8hfLYcktFmorshW3YyLZoUDKr",
    "Size": "819"
}
{
    "Name": "9dc3ce44b9.json",
    "Hash": "QmXRWCE2B3CaesLvMhWbtXZvnX82gVFbDSd8wDYcwhFxoN",
    "Size": "814"
}
{
    "Name": "344c659042.json",
    "Hash": "QmZyBA9KmcS4UymnPRkNGuyUtc9pZihKgxzkomPcQntNCX",
    "Size": "819"
}
{
    "Name": "975e93b4f8.json",
    "Hash": "QmXt47VoXtMALBSmP5QBfGkEbfD5qvRkS1CXqR65pXSTkn",
    "Size": "823"
}
{
    "Name": "32219ca53a.json",
    "Hash": "QmRK1pFcZsPVZfxcatHFz6qLZmPbWgcuiNKfUP3ZL53JJF",
    "Size": "817"
}
{
    "Name": "379791bb6d.json",
    "Hash": "QmSAk2MwGTG3pe6BNfPANmf5rGQHQi2TpYxr556qa9UAu4",
    "Size": "817"
}
{
    "Name": "7110111943.json",
    "Hash": "QmdU4DtBBN8xnoBUmiqhXmYfgxyYgQ8HVcrJ1G3PVmgLcT",
    "Size": "817"
}
{
    "Name": "b757255117.json",
    "Hash": "QmTqukXLtSUWXLeaSPkSpsPBguZb2qZvTugEng8mXJ3dAN",
    "Size": "820"
}
{
    "Name": "c7e2d0588e.json",
    "Hash": "QmU8RCAdLudgzSkyCPKNUdF5pajNZvMHZ26SM4uZXJGUj8",
    "Size": "814"
}
{
    "Name": "c870c1291f.json",
    "Hash": "QmW2UpXmE8tYVM7HPozY1Wdapsufgtu9Nn2dUT5qTYhaUg",
    "Size": "814"
}
{
    "Name": "c04507c476.json",
    "Hash": "QmX5gWJdUkVo5b2TtRf9XnJbvcR4yzew7KfVS2kCFkSK73",
    "Size": "820"
}
{
    "Name": "c4594473bb.json",
    "Hash": "Qmap5dyifRcebr5A2uRxLkabDifESXnoWPYBno8jobESkg",
    "Size": "817"
}
{
    "Name": "d3a703c92c.json",
    "Hash": "QmV17T3NeiyrBk2vkpV5NQtJVVCoxT5cnPEJsoteaKfN81",
    "Size": "820"
}
{
    "Name": "dd93e86786.json",
    "Hash": "QmRUbK7icsWJSfq1f1xC4GjCxiJEAECrfFdApfCThNZcL1",
    "Size": "819"
}
{
    "Name": "e11c09630d.json",
    "Hash": "Qmeu9wqD6mswNA2wGHBZSnURaRfnPoH7mwVToitmwRAESp",
    "Size": "817"
}
{
    "Name": "e583f6e911.json",
    "Hash": "QmcKzxeFy7MZZsvxCZX8JR8Xtmc8PERubV7AK8EhNSCjij",
    "Size": "818"
}
{
    "Name": "f9bac46f24.json",
    "Hash": "QmYWSK1KztEBr723m2gnXkt3dE8snCqCTqsXMiPWnxbRpD",
    "Size": "814"
}
{
    "Name": "f11c6e7db8.json",
    "Hash": "QmbbsZcbAtDzN1fvRE1gBLHBCSNh1ZtJUHFp5cMcn987fj",
    "Size": "820"
}
{
    "Name": "",
    "Hash": "QmQbRroNMsDZuYEG3w6ZfJa8PA8EpaQdAJVMZ8MMZQFXWs",
    "Size": "17519"
}
```

## 2. 컨트랙트 배포
### 2.0. Contract 생성
Shell script 이용. (생략)

### 2.1. Compile
Hardhat을 이용하여 컨트랙트 컴파일
ABI, Bytecode를 획득

### 2.2. Deploy
ABI와 Bytecode를 application에 전달하고 메타마스크를 활용하여 배포 진행
배포 후 contract address 획득
e.g. `0x171989A4080bCEc8B4C67f49699c33311bCF116E`

### 3. Voucher 발급
### 4. 민팅