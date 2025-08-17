import { ethers } from "hardhat";

async function main() {
  // Deploy the ProofMint contract
  const ProofMint = await ethers.getContractFactory("ProofMint");
  const proofMint = await ProofMint.deploy();
  
  await proofMint.waitForDeployment();
  
  console.log("ProofMint deployed to:", await proofMint.getAddress());
  
  // Get the deployer account
  const [deployer, issuer, recipient] = await ethers.getSigners();
  
  console.log("Deployer address:", deployer.address);
  console.log("Issuer address:", issuer.address);
  console.log("Recipient address:", recipient.address);
  
  // Register an issuer
  console.log("\nRegistering issuer...");
  await proofMint.connect(issuer).registerIssuer("Test University", "A test university for demonstration");
  console.log("Issuer registered");
  
  // Create a certificate type
  console.log("\nCreating certificate type...");
  const certTypeTx = await proofMint.connect(issuer).createCertificateType(
    "Blockchain Developer Certificate", 
    "Certificate for completing blockchain development course"
  );
  const certTypeReceipt = await certTypeTx.wait();
  const certificateTypeId = certTypeReceipt.logs[0].args?.certificateTypeId || 0;
  console.log("Certificate type created with ID:", certificateTypeId.toString());
  
  // Mint a credential
  console.log("\nMinting credential...");
  const tokenURI = "ipfs://QmTest123";
  const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("test metadata"));
  
  const mintTx = await proofMint.connect(issuer).mintCredential(
    recipient.address,
    certificateTypeId,
    tokenURI,
    metadataHash,
    "Completion of Blockchain Developer Course"
  );
  const mintReceipt = await mintTx.wait();
  const tokenId = mintReceipt.logs[0].args?.tokenId || 0;
  console.log("Credential minted with token ID:", tokenId.toString());
  
  // Verify the credential
  console.log("\nVerifying credential...");
  const isValid = await proofMint.isValidCredential(tokenId);
  console.log("Credential is valid:", isValid);
  
  // Get certificate details
  console.log("\nGetting certificate details...");
  const certificate = await proofMint.getCertificate(tokenId);
  console.log("Certificate details:", {
    tokenId: certificate.tokenId.toString(),
    recipient: certificate.recipient,
    issuer: certificate.issuer,
    certificateTypeId: certificate.certificateTypeId.toString(),
    description: certificate.description,
    timestamp: new Date(Number(certificate.timestamp) * 1000).toISOString(),
    isRevoked: certificate.isRevoked,
    metadataHash: certificate.metadataHash
  });
  
  console.log("\nDeployment and testing completed successfully!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});