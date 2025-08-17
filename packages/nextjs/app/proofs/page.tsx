"use client";

import { useState } from "react";
import { useScaffoldReadContract } from "../../hooks/scaffold-eth";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { DocumentCheckIcon, ShieldCheckIcon, XCircleIcon } from "@heroicons/react/24/outline";

const Proofs = () => {
  const { address } = useAccount();
  const [filter, setFilter] = useState<"all" | "valid" | "revoked">("all");

  // Get certificates for the current user
  const { data: userCertificateIds = [], isLoading: isUserCertificatesLoading } = useScaffoldReadContract({
    contractName: "ProofMint",
    functionName: "getRecipientCredentials",
    args: [address as Address],
  });

  // We'll fetch individual certificate details in the render function
  // to avoid React Hook rule violations

  // Component to display individual certificate row
  const CertificateRow = ({ certificateId }: { certificateId: bigint }) => {
    const { data: certificate, isLoading: isCertificateLoading } = useScaffoldReadContract({
      contractName: "ProofMint",
      functionName: "getCertificate",
      args: [certificateId],
    });

    const { data: isValid, isLoading: isValidLoading } = useScaffoldReadContract({
      contractName: "ProofMint",
      functionName: "isValidCredential",
      args: [certificateId],
    });

    if (isCertificateLoading || isValidLoading) {
      return (
        <tr className="hover:bg-base-200">
          <td className="px-4 py-4 whitespace-nowrap" colSpan={5}>
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-sm"></span>
            </div>
          </td>
        </tr>
      );
    }

    if (!certificate) {
      return null;
    }

    return (
      <tr className="hover:bg-base-200">
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="font-medium text-base-content">Certificate #{certificateId.toString()}</div>
          <div className="text-sm text-base-content/70 truncate max-w-xs">
            {certificate.description || "No description"}
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <span className="px-2 py-1 text-xs font-medium bg-base-200 text-base-content rounded">
            {certificate.issuer?.substring(0, 6)}...{certificate.issuer?.substring(38)}
          </span>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${
              isValid ? "bg-success/10 text-success" : "bg-error/10 text-error"
            }`}
          >
            {isValid ? (
              <span className="flex items-center">
                <ShieldCheckIcon className="h-3 w-3 mr-1" />
                Valid
              </span>
            ) : (
              <span className="flex items-center">
                <XCircleIcon className="h-3 w-3 mr-1" />
                Revoked
              </span>
            )}
          </span>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-base-content/70">
          {certificate.timestamp ? new Date(Number(certificate.timestamp) * 1000).toLocaleDateString() : "Unknown"}
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
          <button className="text-primary hover:text-accent mr-3">View</button>
          <button className="text-base-content/70 hover:text-base-content">Share</button>
        </td>
      </tr>
    );
  };

  if (!address) {
    return (
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <div className="glass-card rounded-lg shadow-sm p-8 text-center">
          <DocumentCheckIcon className="h-16 w-16 text-base-content/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-base-content mb-4">My Certificates</h2>
          <p className="text-base-content/70 mb-6">Please connect your wallet to view your certificates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
      <div className="glass-card rounded-lg shadow-sm p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-base-content">My Certificates</h1>
            <p className="text-base-content/70">All digital proofs issued to your wallet</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-outline"}`}
            >
              All ({userCertificateIds.length})
            </button>
            <button
              onClick={() => setFilter("valid")}
              className={`btn btn-sm ${filter === "valid" ? "btn-success" : "btn-outline"}`}
            >
              Valid
            </button>
            <button
              onClick={() => setFilter("revoked")}
              className={`btn btn-sm ${filter === "revoked" ? "btn-error" : "btn-outline"}`}
            >
              Revoked
            </button>
          </div>
        </div>

        {isUserCertificatesLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : userCertificateIds.length === 0 ? (
          <div className="text-center py-12">
            <DocumentCheckIcon className="h-16 w-16 text-base-content/30 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-base-content mb-2">
              {filter === "all"
                ? "No certificates found"
                : filter === "valid"
                  ? "No valid certificates"
                  : "No revoked certificates"}
            </h3>
            <p className="text-base-content/70 mb-6">
              {filter === "all"
                ? "You don't have any certificates yet."
                : filter === "valid"
                  ? "You don't have any valid certificates."
                  : "You don't have any revoked certificates."}
            </p>
            <a href="/create" className="btn btn-primary">
              Create New Proof
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-base-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    Certificate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    Issuer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-base-100 divide-y divide-base-200">
                {userCertificateIds.map((id: bigint) => (
                  <CertificateRow key={id.toString()} certificateId={id} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Proofs;
