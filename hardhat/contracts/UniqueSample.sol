pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

contract UniqueSample is ERC721URIStorage, EIP712 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    string private constant SIGNING_DOMAIN = "Unique Sample";
    string private constant SIGNATURE_VERSION = "1";

    struct NFTVoucher {
        uint256 tokenId;
        bytes signature;
    }

    constructor() 
        ERC721("Unique Sample", "US")
        EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION)
    {}

    /**
    * Mints 
    */
    function mint(string memory tokenURI) public returns (uint256){
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        return newItemId;
    }

    /**
    * Mints and Transfer 
    */
    function mintWithTransfer(address delegator, string memory tokenURI) public returns (uint256){
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _transfer(msg.sender, delegator, newItemId);

        return newItemId;
    }

    /**
    * Mints and event Transfer 
    * only event
    */
    function mintWithEvent(address delegator, string memory tokenURI) public returns (uint256){
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        emit Transfer(msg.sender, delegator, newItemId);

        return newItemId;
    }

    /**
    * Redeem
    */
    function redeem(NFTVoucher calldata voucher, string memory tokenURI) public returns (uint256) {
        address signer = _verify(voucher);

        _safeMint(msg.sender, voucher.tokenId);
        _setTokenURI(voucher.tokenId, tokenURI);

        _transfer(msg.sender, signer, voucher.tokenId);

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
}
