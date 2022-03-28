// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

/**
 * 1. 리빌 여부
 * 2. 소각 여부
 * 3. 팀 물량 ( 팀 물량 민팅비용은 누가 지불? )
 */

/**
 * Not reveal
 */
contract GenerativeAlphaDev is ERC721URIStorage, ERC721Enumerable, EIP712, AccessControl, Ownable {
    
    /* Voucher */
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    string private constant SIGNING_DOMAIN = "GenerativeAlphaDev";
    string private constant SIGNATURE_VERSION = "1";
    struct NFTVoucher {
        // address buyer;
        uint256 tokenId;
        string uri;
        bytes signature;
    }

    /* Requirement */
    uint256 public MAX_SUPPLY;
    string public baseURI;
    address public vault;

    /* Sale */
    bool public isActive;
    uint256 public price;

    constructor(address minter) 
        ERC721("GenerativeAlphaDev", "GAD")
        EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION) {
            _setupRole(MINTER_ROLE, minter);
            setBaseURI("ipfs://sample")
        }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string calldata uri) external onlyOwner {
        baseURI = uri;
    }

    function setVault(address _vault) external onlyOwner {
        vault = _vault;
    }

    function setActive(bool _isActive) external onlyOwner {
        isActive = _isActive;
    }

    /* Redeem */
    function redeem(NFTVoucher calldata voucher) external payable returns (uint256) {
        require(IsActive, "Sale must be active to mint");
        require(msg.value >= price, 'Ether Amount Denied');

        address signer = _verify(voucher);
        require(hasRole(MINTER_ROLE, signer), "Signature invalid or unauthorized");

        _safeMint(msg.sender, voucher.tokenId);
        _setTokenURI(voucher.tokenId, voucher.uri);

        /**
        * It will be used in the beta version.
        */
        // _transfer(msg.sender, BB, voucher.tokenId);
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
            keccak256("NFTVoucher(string uri)"),
            keccak256(bytes(voucher.uri))
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

    /**
    * For ERC-165
    */
    function supportsInterface(bytes4 interfaceId) public view virtual override (AccessControl, ERC721) returns (bool) {
        return ERC721.supportsInterface(interfaceId) || AccessControl.supportsInterface(interfaceId);
    }

    // Send balance of contract to address referenced in `vault`
    function withdraw() external payable onlyOwner {
        require(vault != address(0), 'Vault Invalid');
        require(payable(vault).send(address(this).balance));
    }
}
