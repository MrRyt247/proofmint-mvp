import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "../scaffold-eth";
import { Address } from "viem";
import { useAccount } from "wagmi";

// Hook to get the ProofMint contract instance
export const useProofMintContract = () => {
  return useScaffoldContract({ contractName: "ProofMint" });
};

// Hook to get the ISSUER_ROLE constant
export const useIssuerRole = () => {
  const { data: issuerRole, isLoading } = useScaffoldReadContract({
    contractName: "ProofMint",
    functionName: "ISSUER_ROLE",
  });

  return { issuerRole, isLoading };
};

// Hook to check if current user is registered as an issuer
export const useIsIssuer = () => {
  const { address } = useAccount();
  const { issuerRole } = useIssuerRole();

  const { data: isIssuer, isLoading } = useScaffoldReadContract({
    contractName: "ProofMint",
    functionName: "hasRole",
    args: [issuerRole, address],
  });

  return { isIssuer, isLoading };
};

// Hook to get issuer profile
export const useIssuerProfile = (issuerAddress: Address) => {
  const { data: profile, isLoading } = useScaffoldReadContract({
    contractName: "ProofMint",
    functionName: "issuerProfiles",
    args: [issuerAddress],
  });

  return { profile, isLoading };
};

// Hook to get certificate by ID
export const useCertificate = (tokenId: bigint) => {
  const { data: certificate, isLoading } = useScaffoldReadContract({
    contractName: "ProofMint",
    functionName: "getCertificate",
    args: [tokenId],
  });

  return { certificate, isLoading };
};

// Hook to check if certificate is valid
export const useIsCertificateValid = (tokenId: bigint) => {
  const { data: isValid, isLoading } = useScaffoldReadContract({
    contractName: "ProofMint",
    functionName: "isValidCredential",
    args: [tokenId],
  });

  return { isValid, isLoading };
};

// Hook to register as an issuer
export const useRegisterIssuer = () => {
  const { writeContractAsync } = useScaffoldWriteContract({ contractName: "ProofMint" });

  const registerIssuer = async (name: string, description: string) => {
    return await writeContractAsync({
      functionName: "registerIssuer",
      args: [name, description],
    });
  };

  return { registerIssuer };
};

// Hook to create certificate type
export const useCreateCertificateType = () => {
  const { writeContractAsync } = useScaffoldWriteContract({ contractName: "ProofMint" });

  const createCertificateType = async (name: string, description: string) => {
    return await writeContractAsync({
      functionName: "createCertificateType",
      args: [name, description],
    });
  };

  return { createCertificateType };
};

// Hook to mint a certificate
export const useMintCertificate = () => {
  const { writeContractAsync } = useScaffoldWriteContract({ contractName: "ProofMint" });

  const mintCertificate = async (
    recipient: Address,
    certificateTypeId: bigint,
    tokenURI: string,
    metadataHash: `0x${string}`,
    description: string,
  ) => {
    return await writeContractAsync({
      functionName: "mintCredential",
      args: [recipient, certificateTypeId, tokenURI, metadataHash, description],
    });
  };

  return { mintCertificate };
};

// Hook to revoke a certificate
export const useRevokeCertificate = () => {
  const { writeContractAsync } = useScaffoldWriteContract({ contractName: "ProofMint" });

  const revokeCertificate = async (tokenId: bigint, reason: string) => {
    return await writeContractAsync({
      functionName: "revokeCredential",
      args: [tokenId, reason],
    });
  };

  return { revokeCertificate };
};
