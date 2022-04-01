// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

contract GenerativeAlphaDev is
    ERC721URIStorage,
    ERC2981,
    EIP712,
    AccessControl,
    Ownable
{
    /* Voucher */
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    string private constant SIGNING_DOMAIN = "VoucherDomain";
    string private constant SIGNATURE_VERSION = "1";
    struct NFTVoucher {
        uint256 tokenId;
        string tokenURI;
        bytes signature;
    }

    /* Requirement */
    uint256 public MAX_SUPPLY;
    string public baseTokenURI;
    address public vault;

    /* Sale */
    bool public isActive;
    uint256 public price;

    /* Loyalty */
    address public royaltyAddress;
    uint96 public royaltyFee;

    constructor(
        string memory _name,
        string memory _symbol,
        address _minter,
        address _royaltyAddress,
        uint96 _royaltyFee,
        uint256 _maxSupply,
        string memory _uri,
        uint256 _price
    ) ERC721(_name, _symbol) EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION) {
        _setupRole(MINTER_ROLE, _minter);
        _setDefaultRoyalty(_royaltyAddress, _royaltyFee);
        royaltyAddress = _royaltyAddress;
        royaltyFee = _royaltyFee;
        MAX_SUPPLY = _maxSupply;
        setBaseURI(_uri);
        setPrice(_price);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function setVault(address _vault) external onlyOwner {
        vault = _vault;
    }

    function setActive(bool _isActive) external onlyOwner {
        isActive = _isActive;
    }

    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
    }

    function setRoyaltyAddress(address _royaltyAddress) external onlyOwner {
        royaltyAddress = _royaltyAddress;
        _setDefaultRoyalty(royaltyAddress, royaltyFee);
    }

    function setRoyaltyFee(uint96 _royaltyFee) external onlyOwner {
        royaltyFee = _royaltyFee;
        _setDefaultRoyalty(royaltyAddress, royaltyFee);
    }
    
    /* Redeem */
    function redeem(NFTVoucher calldata voucher) external payable {
        require(isActive, "Sale must be active to mint");
        require(voucher.tokenId + 1 <= MAX_SUPPLY, "Reached max supply.");
        require(tx.origin == msg.sender, "The caller is another contract.");
        require(msg.value >= price, "Need to send more ETH.");
        address signer = _verify(voucher);
        require(
            hasRole(MINTER_ROLE, signer),
            "Signature invalid or unauthorized"
        );

        _safeMint(msg.sender, voucher.tokenId);
        _setTokenURI(voucher.tokenId, voucher.tokenURI);
    }

    /* Send balance of contract to address referenced in `vault` */
    function withdraw() external payable onlyOwner {
        require(vault != address(0), "Vault Invalid");
        require(payable(vault).send(address(this).balance));
    }

    /* Verifies the signature for a given Voucher. */
    function _verify(NFTVoucher calldata voucher)
        internal
        view
        returns (address)
    {
        bytes32 digest = _hash(voucher);
        return ECDSA.recover(digest, voucher.signature);
    }

    /* Returns a hash of the given Voucher */
    function _hash(NFTVoucher calldata voucher)
        internal
        view
        returns (bytes32)
    {
        return
            _hashTypedDataV4(
                keccak256(
                    abi.encode(
                        keccak256(
                            "NFTVoucher(uint256 tokenId, string tokenURI)"
                        ),
                        voucher.tokenId,
                        keccak256(bytes(voucher.tokenURI))
                    )
                )
            );
    }

    /* Returns the chain id of the current blockchain. */
    function getChainID() external view returns (uint256) {
        uint256 id;
        assembly {
            id := chainid()
        }
        return id;
    }

    /* For ERC-165 */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC2981, AccessControl)
        returns (bool)
    {
        return
            ERC721.supportsInterface(interfaceId) ||
            ERC2981.supportsInterface(interfaceId) ||
            AccessControl.supportsInterface(interfaceId);
    }
}
