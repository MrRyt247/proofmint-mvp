import { expect } from "chai";
import { ethers } from "hardhat";
import { ProofMint } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("ProofMint", function () {
  let proofMint: ProofMint;
  let owner: SignerWithAddress;
  let issuer: SignerWithAddress;
  let recipient: SignerWithAddress;
  let otherAccount: SignerWithAddress;

  before(async () => {
    [owner, issuer, recipient, otherAccount] = await ethers.getSigners();
    const proofMintFactory = await ethers.getContractFactory("ProofMint");
    proofMint = await proofMintFactory.deploy();
    await proofMint.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await proofMint.name()).to.equal("ProofMint Credentials");
      expect(await proofMint.symbol()).to.equal("PROOF");
    });

    it("Should grant DEFAULT_ADMIN_ROLE to the deployer", async function () {
      expect(await proofMint.hasRole(await proofMint.DEFAULT_ADMIN_ROLE(), owner.address)).to.be.true;
    });

    it("Should grant PAUSER_ROLE to the deployer", async function () {
      expect(await proofMint.hasRole(await proofMint.PAUSER_ROLE(), owner.address)).to.be.true;
    });
  });

  describe("Issuer Management", function () {
    it("Should allow an account to register as an issuer", async function () {
      await expect(proofMint.connect(issuer).registerIssuer("Test University", "A test university"))
        .to.emit(proofMint, "IssuerRegistered")
        .withArgs(issuer.address, "Test University");

      expect(await proofMint.hasRole(await proofMint.ISSUER_ROLE(), issuer.address)).to.be.true;

      const issuerProfile = await proofMint.issuerProfiles(issuer.address);
      expect(issuerProfile.name).to.equal("Test University");
      expect(issuerProfile.description).to.equal("A test university");
    });

    it("Should fail to register with empty name", async function () {
      await expect(proofMint.connect(otherAccount).registerIssuer("", "No name")).to.be.revertedWith(
        "Name cannot be empty"
      );
    });
  });

  describe("Certificate Type Management", function () {
    before(async function () {
      // Register issuer first
      await proofMint.connect(issuer).registerIssuer("Test University", "A test university");
    });

    it("Should allow an issuer to create a certificate type", async function () {
      await expect(
        proofMint.connect(issuer).createCertificateType("Blockchain Developer Certificate", "Certificate for blockchain developers")
      )
        .to.emit(proofMint, "CertificateTypeCreated")
        .withArgs(0, issuer.address, "Blockchain Developer Certificate");

      const certType = await proofMint.getCertificateType(0);
      expect(certType.name).to.equal("Blockchain Developer Certificate");
      expect(certType.description).to.equal("Certificate for blockchain developers");
      expect(certType.issuer).to.equal(issuer.address);
      expect(certType.isActive).to.be.true;
    });

    it("Should fail if non-issuer tries to create certificate type", async function () {
      await expect(
        proofMint.connect(recipient).createCertificateType("Invalid Certificate", "Should fail")
      ).to.be.reverted;
    });

    it("Should fail to create certificate type with empty name", async function () {
      await expect(
        proofMint.connect(issuer).createCertificateType("", "No name")
      ).to.be.revertedWith("Certificate type name cannot be empty");
    });

    it("Should allow issuer to deactivate certificate type", async function () {
      // Create another certificate type first
      await proofMint.connect(issuer).createCertificateType("Web3 Certificate", "Certificate for web3 developers");
      
      // Deactivate it
      await expect(proofMint.connect(issuer).deactivateCertificateType(1))
        .to.not.be.reverted;
      
      const certType = await proofMint.getCertificateType(1);
      expect(certType.isActive).to.be.false;
    });

    it("Should fail if non-creator tries to deactivate certificate type", async function () {
      await expect(
        proofMint.connect(recipient).deactivateCertificateType(0)
      ).to.be.reverted;
    });
  });

  describe("Credential Minting", function () {
    before(async function () {
      // Register issuer and create certificate type if not already done
      try {
        await proofMint.connect(issuer).registerIssuer("Test University", "A test university");
      } catch (e) {
        // Already registered
      }
      
      try {
        await proofMint.connect(issuer).createCertificateType("Developer Certificate", "Certificate for developers");
      } catch (e) {
        // Already created
      }
    });

    it("Should allow issuer to mint a credential", async function () {
      const tokenURI = "ipfs://QmTest123";
      const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("test metadata"));

      await expect(
        proofMint.connect(issuer).mintCredential(
          recipient.address,
          0, // certificateTypeId
          tokenURI,
          metadataHash,
          "Completion of Blockchain Developer Course"
        )
      )
        .to.emit(proofMint, "CertificateMinted")
        .withArgs(0, recipient.address, issuer.address, 0);

      // Check certificate details
      const certificate = await proofMint.getCertificate(0);
      expect(certificate.recipient).to.equal(recipient.address);
      expect(certificate.issuer).to.equal(issuer.address);
      expect(certificate.certificateTypeId).to.equal(0);
      expect(certificate.description).to.equal("Completion of Blockchain Developer Course");
      expect(certificate.isRevoked).to.be.false;
      expect(certificate.metadataHash).to.equal(metadataHash);

      // Check token URI
      expect(await proofMint.tokenURI(0)).to.equal(tokenURI);

      // Check recipient credentials
      const recipientCredentials = await proofMint.getRecipientCredentials(recipient.address);
      expect(recipientCredentials.map(bn => bn.toString())).to.deep.equal(["0"]);

      // Check issuer credentials
      const issuerCredentials = await proofMint.getIssuerCredentials(issuer.address);
      expect(issuerCredentials.map(bn => bn.toString())).to.deep.equal(["0"]);

      // Check issuer profile update
      const issuerProfile = await proofMint.issuerProfiles(issuer.address);
      expect(issuerProfile.credentialsIssued).to.equal(1);
    });

    it("Should fail if non-issuer tries to mint", async function () {
      const tokenURI = "ipfs://QmTest123";
      const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("test metadata"));

      await expect(
        proofMint.connect(recipient).mintCredential(
          recipient.address,
          0,
          tokenURI,
          metadataHash,
          "Should fail"
        )
      ).to.be.reverted;
    });

    it("Should fail to mint with invalid certificate type", async function () {
      const tokenURI = "ipfs://QmTest123";
      const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("test metadata"));

      await expect(
        proofMint.connect(issuer).mintCredential(
          recipient.address,
          999, // Invalid certificateTypeId
          tokenURI,
          metadataHash,
          "Should fail"
        )
      ).to.be.reverted;
    });

    it("Should fail to mint with deactivated certificate type", async function () {
      const tokenURI = "ipfs://QmTest123";
      const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("test metadata"));

      await expect(
        proofMint.connect(issuer).mintCredential(
          recipient.address,
          1, // Deactivated certificateTypeId
          tokenURI,
          metadataHash,
          "Should fail"
        )
      ).to.be.reverted;
    });
  });

  describe("Soulbound Implementation", function () {
    it("Should prevent transfer of minted credentials", async function () {
      // Try to transfer the token (should fail)
      try {
        await proofMint.connect(recipient).transferFrom(recipient.address, otherAccount.address, 0);
        // If we reach here, the transfer succeeded when it should have failed
        expect.fail("Transfer should have been prevented");
      } catch (error) {
        // Check that the error is the expected TransferNotAllowed error
        expect(error.message).to.include("TransferNotAllowed");
      }

      // Try to approve (should fail)
      try {
        await proofMint.connect(recipient).approve(otherAccount.address, 0);
        expect.fail("Approval should have been prevented");
      } catch (error) {
        expect(error.message).to.include("TransferNotAllowed");
      }

      // Try to set approval for all (should fail)
      try {
        await proofMint.connect(recipient).setApprovalForAll(otherAccount.address, true);
        expect.fail("SetApprovalForAll should have been prevented");
      } catch (error) {
        expect(error.message).to.include("TransferNotAllowed");
      }
    });
  });

  describe("Credential Revocation", function () {
    it("Should allow issuer to revoke a credential", async function () {
      // First mint a new credential to revoke
      const tokenURI = "ipfs://QmTest456";
      const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("test metadata 2"));
      
      const mintTx = await proofMint.connect(issuer).mintCredential(
        recipient.address,
        0,
        tokenURI,
        metadataHash,
        "Another certificate"
      );
      const mintReceipt = await mintTx.wait();
      const mintEvent = mintReceipt.logs.find((log: any) => {
        try {
          return proofMint.interface.parseLog(log)?.name === "CertificateMinted";
        } catch {
          return false;
        }
      });
      
      let tokenId = 1; // Default to 1
      if (mintEvent) {
        const parsedLog = proofMint.interface.parseLog(mintEvent);
        tokenId = parsedLog.args.tokenId;
      }
      
      await expect(proofMint.connect(issuer).revokeCredential(tokenId, "Reason for revocation"))
        .to.emit(proofMint, "CertificateRevoked")
        .withArgs(tokenId, issuer.address, "Reason for revocation");

      const certificate = await proofMint.getCertificate(tokenId);
      expect(certificate.isRevoked).to.be.true;
    });

    it("Should fail if non-issuer tries to revoke", async function () {
      // Mint a new credential first
      const tokenURI = "ipfs://QmTest789";
      const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("test metadata 3"));
      
      const mintTx = await proofMint.connect(issuer).mintCredential(
        recipient.address,
        0,
        tokenURI,
        metadataHash,
        "Another certificate"
      );
      const mintReceipt = await mintTx.wait();
      const mintEvent = mintReceipt.logs.find((log: any) => {
        try {
          return proofMint.interface.parseLog(log)?.name === "CertificateMinted";
        } catch {
          return false;
        }
      });
      
      let tokenId = 2; // Default to 2
      if (mintEvent) {
        const parsedLog = proofMint.interface.parseLog(mintEvent);
        tokenId = parsedLog.args.tokenId;
      }
      
      // Try to revoke (should fail)
      await expect(
        proofMint.connect(recipient).revokeCredential(tokenId, "Unauthorized revocation")
      ).to.be.reverted;
    });
  });

  describe("View Functions", function () {
    it("Should return correct certificate validity", async function () {
      // Revoked certificate should be invalid
      expect(await proofMint.isValidCredential(1)).to.be.false;
      
      // Valid certificate should be valid
      expect(await proofMint.isValidCredential(2)).to.be.true;
    });

    it("Should return correct total supply", async function () {
      expect(await proofMint.totalSupply()).to.equal(3);
    });

    it("Should return correct total certificate types", async function () {
      expect(await proofMint.totalCertificateTypes()).to.equal(3);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow pauser to pause and unpause", async function () {
      // Pause the contract
      await expect(proofMint.connect(owner).pause())
        .to.emit(proofMint, "Paused")
        .withArgs(owner.address);

      // Try to mint while paused (should fail)
      const tokenURI = "ipfs://QmTest999";
      const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("test metadata 4"));
      
      await expect(
        proofMint.connect(issuer).mintCredential(
          recipient.address,
          0,
          tokenURI,
          metadataHash,
          "Should fail - paused"
        )
      ).to.be.reverted;

      // Unpause the contract
      await expect(proofMint.connect(owner).unpause())
        .to.emit(proofMint, "Unpaused")
        .withArgs(owner.address);
    });
  });
});