"use client";

import { useState } from "react";
import { useCertificate, useIsCertificateValid } from "../../hooks/proofmint";
import { isAddress } from "viem";
import {
  CalendarIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  UserIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const Verify = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenId, setTokenId] = useState<bigint | null>(null);

  // Get certificate data if we have a valid token ID
  const { certificate, isLoading: isCertificateLoading } = useCertificate(tokenId || 0n);
  const { isValid, isLoading: isValidLoading } = useIsCertificateValid(tokenId || 0n);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setVerificationResult(null);

    try {
      // Try to parse the search query as a token ID
      const tokenId = BigInt(searchQuery.trim());
      setTokenId(tokenId);
    } catch {
      // If it's not a valid token ID, check if it's an address
      if (isAddress(searchQuery.trim())) {
        // In a real app, we would fetch certificates for this address
        // For now, we'll just show an error
        setVerificationResult({
          isValid: false,
          error: "Address verification not implemented in this demo. Please enter a certificate ID.",
        });
        setIsLoading(false);
        return;
      } else {
        setVerificationResult({
          isValid: false,
          error: "Invalid input. Please enter a valid certificate ID (number).",
        });
        setIsLoading(false);
        return;
      }
    }
  };

  const resetVerification = () => {
    setVerificationResult(null);
    setSearchQuery("");
    setTokenId(null);
  };

  // If we have a token ID, show the certificate data
  if (tokenId !== null && (isCertificateLoading || isValidLoading)) {
    return (
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <div className="glass-card rounded-lg shadow-sm p-8">
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  // If we have certificate data, show the verification result
  if (tokenId !== null && certificate && certificate.recipient !== "0x0000000000000000000000000000000000000000") {
    const isValidResult = isValid !== undefined ? isValid : false;

    return (
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="glass-card rounded-lg shadow-sm p-8 mb-8">
          <div className="text-center mb-8">
            <ShieldCheckIcon className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-base-content mb-2">Verify Digital Proof</h2>
            <p className="text-base-content/70">
              Enter a proof ID, wallet address, or transaction hash to verify authenticity
            </p>
          </div>

          <form onSubmit={handleVerification} className="max-w-2xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Enter proof ID, wallet address, or transaction hash..."
                  className="input input-bordered w-full pl-12"
                  disabled={isLoading}
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
              </div>
              <button type="submit" className="btn btn-primary" disabled={!searchQuery.trim() || isLoading}>
                {isLoading ? <span className="loading loading-spinner loading-sm"></span> : "Verify"}
              </button>
            </div>
          </form>
        </div>

        {/* Verification Result */}
        <div className="glass-card rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-base-content">Verification Result</h3>
            <button onClick={resetVerification} className="btn btn-sm btn-outline">
              New Search
            </button>
          </div>

          {/* Verification Status */}
          <div
            className={`p-6 rounded-lg border-2 mb-6 ${
              isValidResult ? "border-success/20 bg-success/5" : "border-error/20 bg-error/5"
            }`}
          >
            <div className="flex items-center">
              {isValidResult ? (
                <ShieldCheckIcon className="h-12 w-12 text-success mr-4" />
              ) : (
                <XCircleIcon className="h-12 w-12 text-error mr-4" />
              )}
              <div>
                <h4 className={`text-xl font-semibold ${isValidResult ? "text-success" : "text-error"}`}>
                  {isValidResult ? "✓ Proof Verified" : "✗ Verification Failed"}
                </h4>
                <p className={`${isValidResult ? "text-success/80" : "text-error/80"}`}>
                  {isValidResult
                    ? "This proof is authentic and has been verified on the blockchain"
                    : "This proof could not be verified or does not exist"}
                </p>
              </div>
            </div>
          </div>

          {/* Proof Details */}
          {isValidResult && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="flex items-start">
                    <DocumentTextIcon className="h-5 w-5 text-base-content/40 mr-3 mt-1" />
                    <div>
                      <p className="text-sm text-base-content/50">Proof Title</p>
                      <p className="font-semibold text-base-content">Certificate #{tokenId.toString()}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <UserIcon className="h-5 w-5 text-base-content/40 mr-3 mt-1" />
                    <div>
                      <p className="text-sm text-base-content/50">Issuer</p>
                      <p className="font-semibold text-base-content">
                        {certificate.issuer.substring(0, 6)}...{certificate.issuer.substring(38)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <CalendarIcon className="h-5 w-5 text-base-content/40 mr-3 mt-1" />
                    <div>
                      <p className="text-sm text-base-content/50">Issue Date</p>
                      <p className="font-semibold text-base-content">
                        {new Date(Number(certificate.timestamp) * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-5 h-5 mr-3 mt-1">
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${isValidResult ? "bg-success" : "bg-error"}`}
                      ></span>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/50">Status</p>
                      <p className={`font-semibold ${isValidResult ? "text-success" : "text-error"}`}>
                        {isValidResult ? "Valid" : "Revoked"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-base-content/50">Proof Holder</p>
                    <p className="font-mono text-sm text-base-content bg-base-200 p-2 rounded">
                      {certificate.recipient}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-base-content/50">Proof ID</p>
                    <p className="font-mono text-sm text-base-content bg-base-200 p-2 rounded">#{tokenId.toString()}</p>
                  </div>

                  <div>
                    <p className="text-sm text-base-content/50">Description</p>
                    <p className="text-base-content bg-base-200 p-2 rounded">
                      {certificate.description || "No description provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-base-content/50">Certificate Type</p>
                    <span className="inline-block px-3 py-1 text-sm bg-primary/20 text-primary rounded-full">
                      #{certificate.certificateTypeId.toString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t pt-6">
                <div className="flex gap-4">
                  <button className="btn btn-outline">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    View Full Details
                  </button>
                  <button className="btn btn-outline">Export Report</button>
                  <button className="btn btn-outline">Share Verification</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-base-100 rounded-lg shadow-sm p-8 mt-8">
          <h3 className="text-lg font-semibold text-base-content mb-4">How to Verify a Proof</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">1</span>
              </div>
              <h4 className="font-medium text-base-content mb-2">Get Proof Information</h4>
              <p className="text-sm text-base-content/70">
                Obtain the proof ID, wallet address, or transaction hash from the proof holder
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">2</span>
              </div>
              <h4 className="font-medium text-base-content mb-2">Enter Information</h4>
              <p className="text-sm text-base-content/70">Paste the proof information into the search field above</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">3</span>
              </div>
              <h4 className="font-medium text-base-content mb-2">Get Results</h4>
              <p className="text-sm text-base-content/70">View the verification status and proof details instantly</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if certificate not found
  if (tokenId !== null && certificate && certificate.recipient === "0x0000000000000000000000000000000000000000") {
    return (
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="glass-card rounded-lg shadow-sm p-8 mb-8">
          <div className="text-center mb-8">
            <ShieldCheckIcon className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-base-content mb-2">Verify Digital Proof</h2>
            <p className="text-base-content/70">
              Enter a proof ID, wallet address, or transaction hash to verify authenticity
            </p>
          </div>

          <form onSubmit={handleVerification} className="max-w-2xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Enter proof ID, wallet address, or transaction hash..."
                  className="input input-bordered w-full pl-12"
                  disabled={isLoading}
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
              </div>
              <button type="submit" className="btn btn-primary" disabled={!searchQuery.trim() || isLoading}>
                {isLoading ? <span className="loading loading-spinner loading-sm"></span> : "Verify"}
              </button>
            </div>
          </form>
        </div>

        {/* Error Result */}
        <div className="glass-card rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-base-content">Verification Result</h3>
            <button onClick={resetVerification} className="btn btn-sm btn-outline">
              New Search
            </button>
          </div>

          <div className="p-6 rounded-lg border-2 border-error/20 bg-error/5">
            <div className="flex items-center">
              <XCircleIcon className="h-12 w-12 text-error mr-4" />
              <div>
                <h4 className="text-xl font-semibold text-error">✗ Certificate Not Found</h4>
                <p className="text-error/80">
                  No certificate found with ID #{tokenId.toString()}. Please check the ID and try again.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show initial search screen or error message
  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
      {/* Search Section */}
      <div className="glass-card rounded-lg shadow-sm p-8 mb-8">
        <div className="text-center mb-8">
          <ShieldCheckIcon className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-base-content mb-2">Verify Digital Proof</h2>
          <p className="text-base-content/70">
            Enter a proof ID, wallet address, or transaction hash to verify authenticity
          </p>
        </div>

        <form onSubmit={handleVerification} className="max-w-2xl mx-auto">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Enter proof ID, wallet address, or transaction hash..."
                className="input input-bordered w-full pl-12"
                disabled={isLoading}
              />
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={!searchQuery.trim() || isLoading}>
              {isLoading ? <span className="loading loading-spinner loading-sm"></span> : "Verify"}
            </button>
          </div>
        </form>

        {verificationResult && !verificationResult.isValid && (
          <div className="mt-4 alert alert-error">
            <XCircleIcon className="h-6 w-6" />
            <span>{verificationResult.error}</span>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-base-100 rounded-lg shadow-sm p-8 mt-8">
        <h3 className="text-lg font-semibold text-base-content mb-4">How to Verify a Proof</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary font-bold">1</span>
            </div>
            <h4 className="font-medium text-base-content mb-2">Get Proof Information</h4>
            <p className="text-sm text-base-content/70">
              Obtain the proof ID, wallet address, or transaction hash from the proof holder
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary font-bold">2</span>
            </div>
            <h4 className="font-medium text-base-content mb-2">Enter Information</h4>
            <p className="text-sm text-base-content/70">Paste the proof information into the search field above</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-primary font-bold">3</span>
            </div>
            <h4 className="font-medium text-base-content mb-2">Get Results</h4>
            <p className="text-sm text-base-content/70">View the verification status and proof details instantly</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
