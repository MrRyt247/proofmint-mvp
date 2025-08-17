// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

/**
 * @title ProofMint - Decentralized Credentialing Platform
 * @dev Soulbound NFT certificates for educational achievements and events
 * @author ProofMint Team
 *
 * This contract implements a decentralized credentialing system where:
 * - Educational institutions can register as issuers
 * - Issuers can create certificate types and mint credentials
 * - All certificates are soulbound (non-transferable)
 * - Recipients own their credentials permanently
 * @custom:security-contact security@proofmint.com
 */
contract ProofMint is ERC721, AccessControl, Pausable, EIP712 {
    using ECDSA for bytes32;

    // ============ STATE VARIABLES ============

    /// @dev Counter for generating unique token IDs
    uint256 private _tokenIdCounter;

    /// @dev Counter for generating unique certificate type IDs
    uint256 private _certificateTypeCounter;

    // ============ ROLE DEFINITIONS ============

    /// @dev Role identifier for entities that can issue certificates
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    /// @dev Role identifier for entities that can pause/unpause the contract
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // ============ EIP712 TYPE HASHES ============

    /// @dev EIP712 type hash for signature-based minting
    bytes32 private constant MINT_TYPEHASH =
        keccak256(
            "MintCredential(address recipient,uint256 certificateTypeId,uint256 timestamp,bytes32 metadataHash,string description)"
        );

    // ============ STRUCTS ============

    /**
     * @dev Represents a certificate/credential issued to a recipient
     * @param tokenId Unique identifier for this certificate
     * @param recipient Address that owns this certificate
     * @param issuer Address of the institution that issued this certificate
     * @param certificateTypeId Reference to the type of certificate
     * @param description Additional details about this specific certificate
     * @param timestamp When this certificate was issued (block timestamp)
     * @param isRevoked Whether this certificate has been revoked
     * @param metadataHash Hash of the metadata stored off-chain (IPFS, etc.)
     */
    struct Certificate {
        uint256 tokenId;
        address recipient;
        address issuer;
        uint256 certificateTypeId;
        string description;
        uint256 timestamp;
        bool isRevoked;
        bytes32 metadataHash;
    }

    /**
     * @dev Profile information for credential issuers (institutions)
     * @param name Display name of the issuing institution
     * @param description Brief description of the institution
     * @param credentialsIssued Total number of credentials issued by this institution
     * @param dateRegistered When this issuer registered on the platform
     */
    struct IssuerProfile {
        string name;
        string description;
        uint256 credentialsIssued;
        uint256 dateRegistered;
    }

    /**
     * @dev Template for certificate types that issuers can create
     * @param certificateTypeId Unique identifier for this certificate type
     * @param name Name of the certificate type (e.g., "Blockchain Developer Certificate")
     * @param description Detailed description of what this certificate represents
     * @param issuer Address of the institution that created this certificate type
     * @param isActive Whether this certificate type is still being issued
     */
    struct CertificateType {
        uint256 certificateTypeId;
        string name;
        string description;
        address issuer;
        bool isActive;
    }

    // ============ MAPPINGS & STORAGE ============

    /// @dev Maps token ID to certificate details
    mapping(uint256 => Certificate) public certificates;

    /// @dev Maps issuer address to their profile information
    mapping(address => IssuerProfile) public issuerProfiles;

    /// @dev Maps recipient address to array of their certificate token IDs
    mapping(address => uint256[]) public recipientCredentials;

    /// @dev Maps issuer address to array of certificate token IDs they've issued
    mapping(address => uint256[]) public issuerCredentials;

    /// @dev Tracks used signatures to prevent replay attacks
    mapping(bytes32 => bool) public usedSignatures;

    /// @dev Maps certificate type ID to certificate type details
    mapping(uint256 => CertificateType) public certificateTypes;

    /// @dev Maps issuer address to array of certificate type IDs they've created
    mapping(address => uint256[]) public issuerCertificateTypes;

    /// @dev Tracks which tokens are locked (soulbound) - prevents transfers
    mapping(uint256 => bool) private _locked;

    /// @dev Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    // ============ EVENTS ============

    /**
     * @dev Emitted when a new certificate is minted
     * @param tokenId The unique token ID of the minted certificate
     * @param recipient Address receiving the certificate
     * @param issuer Address of the issuing institution
     * @param certificateTypeId Type of certificate issued
     */
    event CertificateMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        address indexed issuer,
        uint256 certificateTypeId
    );

    /**
     * @dev Emitted when a certificate is revoked
     * @param tokenId The token ID of the revoked certificate
     * @param issuer Address that revoked the certificate
     * @param reason Human-readable reason for revocation
     */
    event CertificateRevoked(uint256 indexed tokenId, address indexed issuer, string reason);

    /**
     * @dev Emitted when a new issuer registers
     * @param issuer Address of the newly registered issuer
     * @param name Name of the issuing institution
     */
    event IssuerRegistered(address indexed issuer, string name);

    /**
     * @dev Emitted when a new certificate type is created
     * @param certificateTypeId Unique identifier for the certificate type
     * @param issuer Address of the institution creating the type
     * @param name Name of the certificate type
     */
    event CertificateTypeCreated(uint256 indexed certificateTypeId, address indexed issuer, string name);

    // ============ CUSTOM ERRORS ============

    /// @dev Thrown when trying to access a non-existent token
    error TokenNotFound();

    /// @dev Thrown when caller lacks required permissions
    error NotAuthorized();

    /// @dev Thrown when trying to use a revoked token
    error TokenRevoked();

    /// @dev Thrown when signature verification fails
    error InvalidSignature();

    /// @dev Thrown when trying to reuse a signature
    error SignatureAlreadyUsed();

    /// @dev Thrown when trying to transfer a soulbound token
    error TransferNotAllowed();

    /// @dev Thrown when issuer is not registered
    error IssuerNotRegistered();

    /// @dev Thrown when certificate type doesn't exist or is inactive
    error InvalidCertificateType();

    // ============ CONSTRUCTOR ============

    /**
     * @dev Initializes the ProofMint contract
     * Sets up the ERC721 token with name and symbol
     * Configures EIP712 for signature verification
     * Grants initial roles to the deployer
     */
    constructor() ERC721("ProofMint Credentials", "PROOF") EIP712("ProofMint", "1") {
        // Grant deployer admin privileges
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        // Allow deployer to pause contract in emergencies
        _grantRole(PAUSER_ROLE, msg.sender);
    }

    // ============ ISSUER MANAGEMENT ============

    /**
     * @dev Allows an address to register as a credential issuer
     * This is the first step for institutions wanting to issue certificates
     *
     * @param name The display name of the institution
     * @param description Brief description of the institution
     *
     * Requirements:
     * - Name cannot be empty
     * - Caller will be granted ISSUER_ROLE automatically
     */
    function registerIssuer(string calldata name, string calldata description) external {
        // Validate input - name is required
        require(bytes(name).length > 0, "Name cannot be empty");

        // Create issuer profile with initial data
        issuerProfiles[msg.sender] = IssuerProfile({
            name: name,
            description: description,
            credentialsIssued: 0, // Start with zero credentials issued
            dateRegistered: block.timestamp // Record registration time
        });

        // Grant issuer role to enable certificate minting
        _grantRole(ISSUER_ROLE, msg.sender);

        // Emit event for indexing and frontend updates
        emit IssuerRegistered(msg.sender, name);
    }

    // ============ CERTIFICATE TYPE MANAGEMENT ============

    /**
     * @dev Allows issuers to create new certificate types
     * Certificate types serve as templates for credentials
     *
     * @param name Name of the certificate type (e.g., "Web3 Developer Certificate")
     * @param description Detailed description of what this certificate represents
     * @return certificateTypeId The unique identifier for the created certificate type
     *
     * Requirements:
     * - Caller must have ISSUER_ROLE
     * - Name cannot be empty
     */
    function createCertificateType(
        string calldata name,
        string calldata description
    ) external onlyRole(ISSUER_ROLE) returns (uint256) {
        // Validate input
        require(bytes(name).length > 0, "Certificate type name cannot be empty");

        // Generate unique certificate type ID
        uint256 certificateTypeId = _certificateTypeCounter;
        _certificateTypeCounter++;

        // Create certificate type struct
        certificateTypes[certificateTypeId] = CertificateType({
            certificateTypeId: certificateTypeId,
            name: name,
            description: description,
            issuer: msg.sender,
            isActive: true // Certificate type is active by default
        });

        // Track certificate types created by this issuer
        issuerCertificateTypes[msg.sender].push(certificateTypeId);

        // Emit event for indexing
        emit CertificateTypeCreated(certificateTypeId, msg.sender, name);

        return certificateTypeId;
    }

    /**
     * @dev Allows issuers to deactivate their certificate types
     * Deactivated types cannot be used to mint new certificates
     *
     * @param certificateTypeId The ID of the certificate type to deactivate
     *
     * Requirements:
     * - Caller must be the issuer who created the certificate type
     * - Certificate type must exist
     */
    function deactivateCertificateType(uint256 certificateTypeId) external {
        // Check if certificate type exists
        CertificateType storage certType = certificateTypes[certificateTypeId];
        require(certType.issuer != address(0), "Certificate type does not exist");

        // Only the original issuer can deactivate
        require(certType.issuer == msg.sender, "Not authorized to deactivate this certificate type");

        // Deactivate the certificate type
        certType.isActive = false;
    }

    // ============ CREDENTIAL MINTING ============

    /**
     * @dev Mints a new certificate to a recipient
     * This is the main function for issuing credentials
     *
     * @param recipient Address that will receive the certificate
     * @param certificateTypeId ID of the certificate type being issued
     * @param tokenURI_ URI pointing to metadata (typically IPFS)
     * @param metadataHash Hash of the metadata for integrity verification
     * @param description Additional description specific to this certificate instance
     * @return tokenId The unique identifier of the minted certificate
     *
     * Requirements:
     * - Caller must have ISSUER_ROLE
     * - Contract must not be paused
     * - Recipient cannot be zero address
     * - Certificate type must exist and be active
     * - Certificate type must be created by the caller
     */
    function mintCredential(
        address recipient,
        uint256 certificateTypeId,
        string calldata tokenURI_,
        bytes32 metadataHash,
        string calldata description
    ) external onlyRole(ISSUER_ROLE) whenNotPaused returns (uint256) {
        // Validate recipient address
        require(recipient != address(0), "Invalid recipient");

        // Validate certificate type
        CertificateType storage certType = certificateTypes[certificateTypeId];
        require(certType.issuer != address(0), "Certificate type does not exist");
        require(certType.isActive, "Certificate type is not active");
        require(certType.issuer == msg.sender, "Not authorized to issue this certificate type");

        // Generate unique token ID
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        // Mint the NFT to the recipient
        _safeMint(recipient, tokenId);

        // Set the token URI for metadata
        _tokenURIs[tokenId] = tokenURI_;

        // Lock the token to make it soulbound (non-transferable)
        _locked[tokenId] = true;

        // Store certificate data on-chain
        certificates[tokenId] = Certificate({
            tokenId: tokenId,
            recipient: recipient,
            issuer: msg.sender,
            certificateTypeId: certificateTypeId,
            description: description,
            timestamp: block.timestamp, // Record when certificate was issued
            isRevoked: false, // Certificates start as valid
            metadataHash: metadataHash
        });

        // Update tracking arrays for easy querying
        recipientCredentials[recipient].push(tokenId);
        issuerCredentials[msg.sender].push(tokenId);

        // Update issuer statistics
        issuerProfiles[msg.sender].credentialsIssued++;

        // Emit event for indexing and notifications
        emit CertificateMinted(tokenId, recipient, msg.sender, certificateTypeId);

        return tokenId;
    }

    /**
     * @dev Mints a certificate using a pre-signed message (gasless minting)
     * Allows issuers to sign minting permissions off-chain, enabling gasless UX
     *
     * @param recipient Address that will receive the certificate
     * @param certificateTypeId ID of the certificate type being issued
     * @param tokenURI_ URI pointing to metadata
     * @param metadataHash Hash of the metadata
     * @param description Additional description for this certificate
     * @param timestamp Timestamp from the original signature (prevents old signature reuse)
     * @param signature EIP712 signature from an authorized issuer
     * @return tokenId The unique identifier of the minted certificate
     *
     * Requirements:
     * - Contract must not be paused
     * - Signature must be valid and from an authorized issuer
     * - Signature must not have been used before
     * - Certificate type must exist and be active
     */
    // function mintWithSignature(
    //     address recipient,
    //     uint256 certificateTypeId,
    //     string calldata tokenURI_,
    //     bytes32 metadataHash,
    //     string calldata description,
    //     uint256 timestamp,
    //     bytes calldata signature
    // ) external whenNotPaused returns (uint256) {
    //     // Construct the message hash according to EIP712 standard
    //     bytes32 structHash = keccak256(
    //         abi.encode(
    //             MINT_TYPEHASH,
    //             recipient,
    //             certificateTypeId,
    //             timestamp,
    //             metadataHash,
    //             keccak256(bytes(description))
    //         )
    //     );

    //     // Generate the final hash with domain separator
    //     bytes32 hash = _hashTypedDataV4(structHash);

    //     // Prevent signature replay attacks
    //     if (usedSignatures[hash]) revert SignatureAlreadyUsed();

    //     // Recover the signer address from the signature
    //     address signer = hash.recover(signature);

    //     // Verify the signer has issuer permissions
    //     if (!hasRole(ISSUER_ROLE, signer)) revert InvalidSignature();

    //     // Validate certificate type and issuer authorization
    //     CertificateType storage certType = certificateTypes[certificateTypeId];
    //     require(certType.issuer != address(0), "Certificate type does not exist");
    //     require(certType.isActive, "Certificate type is not active");
    //     require(certType.issuer == signer, "Signer not authorized for this certificate type");

    //     // Mark signature as used to prevent replay
    //     usedSignatures[hash] = true;

    //     // Generate unique token ID
    //     uint256 tokenId = _tokenIdCounter.current();
    //     _tokenIdCounter.increment();

    //     // Mint the NFT
    //     _safeMint(recipient, tokenId);
    //     _setTokenURI(tokenId, tokenURI_);

    //     // Make token soulbound
    //     _locked[tokenId] = true;

    //     // Store certificate data
    //     certificates[tokenId] = Certificate({
    //         tokenId: tokenId,
    //         recipient: recipient,
    //         issuer: signer, // Use recovered signer as issuer
    //         certificateTypeId: certificateTypeId,
    //         description: description,
    //         timestamp: timestamp, // Use timestamp from signature
    //         isRevoked: false,
    //         metadataHash: metadataHash
    //     });

    //     // Update tracking arrays and statistics
    //     recipientCredentials[recipient].push(tokenId);
    //     issuerCredentials[signer].push(tokenId);
    //     issuerProfiles[signer].credentialsIssued++;

    //     // Emit event
    //     emit CertificateMinted(tokenId, recipient, signer, certificateTypeId);

    //     return tokenId;
    // }

    // ============ CREDENTIAL MANAGEMENT ============

    /**
     * @dev Revokes a previously issued certificate
     * Revoked certificates remain on-chain but are marked as invalid
     *
     * @param tokenId The ID of the certificate to revoke
     * @param reason Human-readable reason for revocation
     *
     * Requirements:
     * - Certificate must exist
     * - Caller must be either the original issuer or an admin
     */
    function revokeCredential(uint256 tokenId, string calldata reason) external {
        // Check if token exists
        if (!_tokenExists(tokenId)) revert TokenNotFound();

        // Get certificate data
        Certificate storage certificate = certificates[tokenId];

        // Authorization check: only issuer or admin can revoke
        require(
            certificate.issuer == msg.sender || hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Not authorized to revoke"
        );

        // Mark certificate as revoked
        certificate.isRevoked = true;

        // Emit revocation event
        emit CertificateRevoked(tokenId, msg.sender, reason);
    }

    // ============ VIEW FUNCTIONS ============

    /**
     * @dev Returns complete certificate information
     * @param tokenId The ID of the certificate to query
     * @return Certificate struct containing all certificate data
     */
    function getCertificate(uint256 tokenId) external view returns (Certificate memory) {
        if (!_tokenExists(tokenId)) revert TokenNotFound();
        return certificates[tokenId];
    }

    function _tokenExists(uint256 tokenId) internal view returns (bool) {
        return certificates[tokenId].recipient != address(0);
    }

    /**
     * @dev Returns certificate type information
     * @param certificateTypeId The ID of the certificate type to query
     * @return CertificateType struct containing certificate type data
     */
    function getCertificateType(uint256 certificateTypeId) external view returns (CertificateType memory) {
        CertificateType memory certType = certificateTypes[certificateTypeId];
        require(certType.issuer != address(0), "Certificate type does not exist");
        return certType;
    }

    /**
     * @dev Returns all certificate token IDs owned by a recipient
     * @param recipient Address to query certificates for
     * @return Array of token IDs owned by the recipient
     */
    function getRecipientCredentials(address recipient) external view returns (uint256[] memory) {
        return recipientCredentials[recipient];
    }

    /**
     * @dev Returns all certificate token IDs issued by an issuer
     * @param issuer Address to query issued certificates for
     * @return Array of token IDs issued by the issuer
     */
    function getIssuerCredentials(address issuer) external view returns (uint256[] memory) {
        return issuerCredentials[issuer];
    }

    /**
     * @dev Returns all certificate type IDs created by an issuer
     * @param issuer Address to query certificate types for
     * @return Array of certificate type IDs created by the issuer
     */
    function getIssuerCertificateTypes(address issuer) external view returns (uint256[] memory) {
        return issuerCertificateTypes[issuer];
    }

    /**
     * @dev Checks if a certificate is valid (exists and not revoked)
     * @param tokenId The ID of the certificate to validate
     * @return True if certificate exists and is not revoked, false otherwise
     */
    function isValidCredential(uint256 tokenId) external view returns (bool) {
        // Return false if token doesn't exist
        if (!_tokenExists(tokenId)) return false;
        // Return true only if certificate is not revoked
        return !certificates[tokenId].isRevoked;
    }

    /**
     * @dev Returns the total number of certificates minted
     * @return Total supply of certificates
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @dev Returns the total number of certificate types created
     * @return Total number of certificate types
     */
    function totalCertificateTypes() external view returns (uint256) {
        return _certificateTypeCounter;
    }

    // ============ SOULBOUND IMPLEMENTATION ============

    /**
     * @dev Overrides the transfer function to implement soulbound behavior
     * Allows minting (owner == 0) and burning (to == 0)
     * Prevents all other transfers to make certificates non-transferable
     *
     * @param to Address receiving the token
     * @param tokenId ID of the token being transferred
     * @param auth Address authorized to make the update
     */
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address owner = _ownerOf(tokenId);
        
        // Allow minting (owner == 0) and burning (to == 0)
        // Prevent all other transfers for soulbound tokens
        if (owner != address(0) && to != address(0)) {
            if (_locked[tokenId]) revert TransferNotAllowed();
        }
        
        address result = super._update(to, tokenId, auth);
        
        // Clean up URI when burning
        if (to == address(0)) {
            delete _tokenURIs[tokenId];
        }
        
        return result;
    }

    /**
     * @dev Overrides approve to prevent token approvals for soulbound tokens
     * Since tokens can't be transferred, approvals should also be disabled
     *
     * @param to Address to approve (will be ignored)
     * @param tokenId ID of the token (used to check if locked)
     */
    function approve(address to, uint256 tokenId) public virtual override {
        // Prevent approvals for locked (soulbound) tokens
        if (_locked[tokenId]) revert TransferNotAllowed();
        // For unlocked tokens (shouldn't exist in this implementation), use standard approval
        super.approve(to, tokenId);
    }

    /**
     * @dev Overrides setApprovalForAll to prevent batch approvals
     * Since all tokens are soulbound, no approvals should be allowed
     *
     * @param operator Address to set approval for (ignored)
     * @param approved Whether to approve or not (ignored)
     */
    function setApprovalForAll(address operator, bool approved) public virtual override {
        // Always revert to prevent any approvals
        revert TransferNotAllowed();
    }

    // ============ ADMIN FUNCTIONS ============

    /**
     * @dev Pauses all certificate minting operations
     * Can be used in emergency situations to halt contract operations
     * Only addresses with PAUSER_ROLE can call this function
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @dev Resumes certificate minting operations
     * Only addresses with PAUSER_ROLE can call this function
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // ============ REQUIRED OVERRIDES ============

    /**
     * @dev Returns the token URI for a given token
     * Required override due to multiple inheritance
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId);
        return _tokenURIs[tokenId];
    }

    /**
     * @dev Returns whether the contract supports a given interface
     * Required override due to multiple inheritance
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
