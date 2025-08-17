import { ethers } from "hardhat";

async function main() {
  // This script assumes the contract is already deployed
  // and demonstrates how to interact with it
  
  // Get the deployed contract
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.log("Please provide a CONTRACT_ADDRESS environment variable");
    return;
  }
  
  const proofMint = await ethers.getContractAt("ProofMint", contractAddress);
  
  console.log("Interacting with ProofMint at:", await proofMint.getAddress());
  
  // Get accounts
  const [deployer, issuer, recipient] = await ethers.getSigners();
  
  // Check if issuer is registered
  const issuerProfile = await proofMint.issuerProfiles(issuer.address);
  if (issuerProfile.name === "") {
    console.log("Registering issuer...");
    await proofMint.connect(issuer).registerIssuer("Test University", "A test university for verification");
    console.log("Issuer registered");
  } else {
    console.log("Issuer already registered:", issuerProfile.name);
  }
  
  // Check existing certificate types
  const totalCertTypes = await proofMint.totalCertificateTypes();
  let certTypeId = 0;
  
  if (totalCertTypes > 0) {
    console.log("Using existing certificate type");
    certTypeId = 0;
  } else {
    console.log("Creating certificate type...");
    const certTypeTx = await proofMint.connect(issuer).createCertificateType(
      "Verification Test Certificate", 
      "Certificate for testing verification"
    );
    const certTypeReceipt = await certTypeTx.wait();
    const certTypeEvent = certTypeReceipt.logs.find((log: any) => {
      try {
        return proofMint.interface.parseLog(log)?.name === "CertificateTypeCreated";
      } catch {
        return false;
      }
    });
    
    if (certTypeEvent) {
      const parsedLog = proofMint.interface.parseLog(certTypeEvent);
      certTypeId = parsedLog.args.certificateTypeId;
    }
    console.log("Certificate type created with ID:", certTypeId.toString());
  }
  
  // Mint a credential for verification
  console.log("\nMinting credential for verification...");
  const tokenURI = "ipfs://QmVerify123";
  const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("verification metadata"));
  
  const mintTx = await proofMint.connect(issuer).mintCredential(
    recipient.address,
    certTypeId,
    tokenURI,
    metadataHash,
    "Verification Test Credential"
  );
  const mintReceipt = await mintTx.wait();
  
  const mintEvent = mintReceipt.logs.find((log: any) => {
    try {
      return proofMint.interface.parseLog(log)?.name === "CertificateMinted";
    } catch {
      return false;
    }
  });
  
  let tokenId = 0;
  if (mintEvent) {
    const parsedLog = proofMint.interface.parseLog(mintEvent);
    tokenId = parsedLog.args.tokenId;
  }
  
  console.log("Credential minted with token ID:", tokenId.toString());
  
  // Verify the credential
  console.log("\nVerifying credential...");
  const isValid = await proofMint.isValidCredential(tokenId);
  console.log("Credential is valid:", isValid);
  
  if (isValid) {
    console.log("✅ VERIFICATION SUCCESSFUL: Credential is valid!");
  } else {
    console.log("❌ VERIFICATION FAILED: Credential is not valid!");
  }
  
  // Get certificate details
  console.log("\nCertificate details:");
  const certificate = await proofMint.getCertificate(tokenId);
  console.log("- Token ID:", certificate.tokenId.toString());
  console.log("- Recipient:", certificate.recipient);
  console.log("- Issuer:", certificate.issuer);
  console.log("- Certificate Type ID:", certificate.certificateTypeId.toString());
  console.log("- Description:", certificate.description);
  console.log("- Issued:", new Date(certificate.timestamp * 1000).toISOString());
  console.log("- Revoked:", certificate.isRevoked);
  console.log("- Metadata Hash:", certificate.metadataHash);
  
  // Test soulbound functionality (should fail)
  console.log("\nTesting soulbound functionality...");
  try {
    await proofMint.connect(recipient).transferFrom(recipient.address, deployer.address, tokenId);
    console.log("❌ TRANSFER SUCCEEDED: This should not happen for soulbound tokens!");
  } catch (error) {
    console.log("✅ TRANSFER PREVENTED: Soulbound functionality working correctly!");
  }
  
  console.log("\nVerification testing completed!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});