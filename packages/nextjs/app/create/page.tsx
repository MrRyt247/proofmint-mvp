"use client";

import { useState } from "react";
import { useCreateCertificateType, useIsIssuer, useMintCertificate } from "../../hooks/proofmint";
import { useScaffoldReadContract } from "../../hooks/scaffold-eth";
import { Address, keccak256, toBytes } from "viem";
import { useAccount } from "wagmi";
import { CloudArrowUpIcon, DocumentCheckIcon, ShieldCheckIcon, UserIcon } from "@heroicons/react/24/outline";

const CreateProof = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    proofType: "",
    title: "",
    description: "",
    category: "",
    file: null as File | null,
  });
  const [selectedCertificateType, setSelectedCertificateType] = useState<bigint | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { address } = useAccount();
  const { isIssuer } = useIsIssuer();
  const { createCertificateType } = useCreateCertificateType();
  const { mintCertificate } = useMintCertificate();

  // Get certificate types for the current issuer
  const { data: certificateTypeIds = [], refetch: refetchCertificateTypes } = useScaffoldReadContract({
    contractName: "ProofMint",
    functionName: "getIssuerCertificateTypes",
    args: [address as Address],
  });

  const proofTypes = [
    {
      id: "identity",
      name: "Identity Document",
      description: "Government-issued ID, passport, or driver's license",
      icon: UserIcon,
    },
    {
      id: "education",
      name: "Educational Certificate",
      description: "Degree, diploma, or academic achievement",
      icon: DocumentCheckIcon,
    },
    {
      id: "professional",
      name: "Professional Certification",
      description: "Industry certifications or professional licenses",
      icon: ShieldCheckIcon,
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleProofTypeSelect = (typeId: string) => {
    setFormData(prev => ({ ...prev, proofType: typeId }));
    setStep(2);
  };

  const handleCertificateTypeSelect = (certTypeId: bigint) => {
    setSelectedCertificateType(certTypeId);
  };

  const handleCreateCertificateType = async () => {
    if (!formData.title || !formData.description) return;

    setIsCreating(true);
    try {
      const result = await createCertificateType(formData.title, formData.description);
      console.log("Certificate type created:", result);

      // Refresh certificate types to include the new one
      await refetchCertificateTypes();

      setStep(3);
    } catch (error) {
      console.error("Error creating certificate type:", error);
      alert("Error creating certificate type. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleMintCertificate = async () => {
    if (!address || !selectedCertificateType || !formData.file) return;

    setIsCreating(true);
    try {
      // In a real app, you would upload the file to IPFS and get the hash
      // For now, we'll simulate this with a hash of the file name
      const fileHash = keccak256(toBytes(formData.file.name));

      const result = await mintCertificate(
        address, // recipient is the current user
        selectedCertificateType,
        `ipfs://${fileHash}`, // tokenURI
        fileHash, // metadataHash
        formData.description || formData.title,
      );

      console.log("Certificate minted:", result);
      alert("Certificate successfully minted!");

      // Reset form after successful minting
      setFormData({
        proofType: "",
        title: "",
        description: "",
        category: "",
        file: null,
      });
      setSelectedCertificateType(null);
      setStep(1);
    } catch (error) {
      console.error("Error minting certificate:", error);
      alert("Error minting certificate. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  // Component to display individual certificate type
  const CertificateTypeItem = ({
    certificateTypeId,
    isSelected,
    onSelect,
  }: {
    certificateTypeId: bigint;
    isSelected: boolean;
    onSelect: (id: bigint) => void;
  }) => {
    const { data: certType, isLoading } = useScaffoldReadContract({
      contractName: "ProofMint",
      functionName: "getCertificateType",
      args: [certificateTypeId],
    });

    if (isLoading) {
      return (
        <div className="p-4 border-2 border-base-200 rounded-lg w-full">
          <div className="font-medium text-base-content">Loading...</div>
        </div>
      );
    }

    if (!certType) {
      return null;
    }

    return (
      <button
        onClick={() => onSelect(certificateTypeId)}
        className={`p-4 border-2 rounded-lg w-full text-left ${
          isSelected ? "border-primary bg-primary/10" : "border-base-200 hover:border-primary"
        }`}
      >
        <div className="font-medium text-base-content">{certType.name}</div>
        <div className="text-sm text-base-content/70">{certType.description}</div>
      </button>
    );
  };

  const renderStep1 = () => (
    <div>
      <h2 className="text-2xl font-bold text-base-content mb-6">Select Proof Type</h2>
      <p className="text-base-content/70 mb-8">Choose the type of proof you want to create</p>

      <div className="grid gap-4">
        {proofTypes.map(type => {
          const IconComponent = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => handleProofTypeSelect(type.id)}
              className="p-6 border-2 border-base-200 rounded-lg hover:border-primary hover:bg-primary/10 transition-colors text-left"
            >
              <div className="flex items-start">
                <div className="p-2 bg-primary/20 rounded-lg mr-4">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-base-content">{type.name}</h3>
                  <p className="text-base-content/70 mt-1">{type.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h2 className="text-2xl font-bold text-base-content mb-6">Create Certificate Type</h2>
      <p className="text-base-content/70 mb-8">Define a new certificate type for your proof</p>

      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-base-content/70 mb-2">
            Certificate Type Name
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="e.g., Bachelor's Degree in Computer Science"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-base-content/70 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            className="textarea textarea-bordered w-full"
            placeholder="Describe this certificate type in detail..."
          />
        </div>

        <div className="flex gap-4 pt-6">
          <button type="button" onClick={() => setStep(1)} className="btn btn-outline flex-1">
            Back
          </button>
          <button
            onClick={handleCreateCertificateType}
            className="btn btn-primary flex-1"
            disabled={!formData.title || !formData.description || isCreating}
          >
            {isCreating ? (
              <span className="flex items-center">
                <span className="loading loading-spinner loading-sm mr-2"></span>
                Creating...
              </span>
            ) : (
              "Create Certificate Type"
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h2 className="text-2xl font-bold text-base-content mb-6">Mint Your Certificate</h2>
      <p className="text-base-content/70 mb-8">Select a certificate type and upload your document</p>

      {!isIssuer ? (
        <div className="alert alert-warning">
          <div>
            <ShieldCheckIcon className="h-6 w-6" />
            <span>You need to be registered as an issuer to create certificates. Please contact an administrator.</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-base-content/70 mb-2">Select Certificate Type</label>
            <div className="space-y-2">
              {certificateTypeIds.map((id: bigint) => (
                <CertificateTypeItem
                  key={id.toString()}
                  certificateTypeId={id}
                  isSelected={selectedCertificateType?.toString() === id.toString()}
                  onSelect={handleCertificateTypeSelect}
                />
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-base-content/70 mb-2">
              Certificate Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="textarea textarea-bordered w-full"
              placeholder="Describe this specific certificate instance..."
            />
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-medium text-base-content/70 mb-2">
              Upload Document
            </label>
            <div className="border-2 border-dashed border-base-200 rounded-lg p-6">
              <div className="text-center">
                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-base-content/40" />
                <div className="mt-4">
                  <label htmlFor="file" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-base-content">
                      Drop files here or click to upload
                    </span>
                    <input
                      id="file"
                      name="file"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                  </label>
                  <p className="mt-2 text-xs text-base-content/50">PDF, JPG, PNG up to 10MB</p>
                </div>
              </div>
              {formData.file && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-success">Selected: {formData.file.name}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button type="button" onClick={() => setStep(2)} className="btn btn-outline flex-1">
              Back
            </button>
            <button
              onClick={handleMintCertificate}
              className="btn btn-primary flex-1"
              disabled={!selectedCertificateType || !formData.file || isCreating}
            >
              {isCreating ? (
                <span className="flex items-center">
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Minting...
                </span>
              ) : (
                "Mint Certificate"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-8">
      <div className="glass-card rounded-lg shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-base-content">Create New Proof</h1>
          <div className="flex items-center mt-4">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1 ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/60"
                }`}
              >
                1
              </div>
              <span className="ml-2 text-sm text-base-content/70">Select Type</span>
            </div>
            <div className="flex-1 h-px bg-base-200 mx-4" />
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2 ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/60"
                }`}
              >
                2
              </div>
              <span className="ml-2 text-sm text-base-content/70">Create Type</span>
            </div>
            <div className="flex-1 h-px bg-base-200 mx-4" />
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 3 ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/60"
                }`}
              >
                3
              </div>
              <span className="ml-2 text-sm text-base-content/70">Mint</span>
            </div>
          </div>
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default CreateProof;
