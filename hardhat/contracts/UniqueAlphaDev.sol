pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

contract UniqueAlphaDev is ERC721URIStorage, EIP712, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    string private constant SIGNING_DOMAIN = "UniqueAlphaDev";
    string private constant SIGNATURE_VERSION = "1";

    /**
    * It will be used in the beta version.
    */
    // address private constant BB = 0x6A5C5f7964d0cA5a313Bd237ecA6657F52F17810;

    struct NFTVoucher {
        uint256 tokenId;
        bytes signature;
    }

    constructor(address minter) 
        ERC721("UniqueAlphaDev", "UAD")
        EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION) {
            _setupRole(MINTER_ROLE, minter);
        }

    /**
    * Redeem
    */
    function redeem(NFTVoucher calldata voucher, string memory tokenURI) public returns (uint256) {
        address signer = _verify(voucher);
        require(hasRole(MINTER_ROLE, signer), "Signature invalid or unauthorized");

        _safeMint(msg.sender, voucher.tokenId);
        _setTokenURI(voucher.tokenId, tokenURI);

        /**
        * It will be used in the beta version.
        */
        // _transfer(msg.sender, BB, voucher.tokenId);

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
}
