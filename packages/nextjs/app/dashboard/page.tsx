"use client";

import Link from "next/link";
import { useUser } from "../../hooks/auth";
import { useIsIssuer } from "../../hooks/proofmint";
import { useScaffoldReadContract } from "../../hooks/scaffold-eth";
import { Address } from "viem";
import { useAccount } from "wagmi";
import {
  ArrowPathIcon,
  BellIcon,
  DocumentCheckIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const { address } = useAccount();
  const { user } = useUser();
  const { isIssuer } = useIsIssuer();

  // Get certificates for the current user
  const { data: userCertificateIds = [], isLoading: isUserCertificatesLoading } = useScaffoldReadContract({
    contractName: "ProofMint",
    functionName: "getRecipientCredentials",
    args: [address as Address],
  });

  // Get issuer profile if user is an issuer
  const { data: issuerProfile, isLoading: isIssuerProfileLoading } = useScaffoldReadContract({
    contractName: "ProofMint",
    functionName: "issuerProfiles",
    args: [address as Address],
  });

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
          <td className="px-3 sm:px-6 py-4 whitespace-nowrap" colSpan={5}>
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
        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
          <div className="font-medium text-base-content text-sm">Certificate #{certificateId.toString()}</div>
        </td>
        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
          <span className="px-2 py-1 text-xs font-medium bg-base-200 text-base-content">
            {certificate.issuer?.substring(0, 6)}...{certificate.issuer?.substring(38)}
          </span>
        </td>
        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${
              isValid ? "bg-success/10 text-success" : "bg-error/10 text-error"
            }`}
          >
            {isValid ? "Valid" : "Revoked"}
          </span>
        </td>
        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-base-content/70">
          {certificate.timestamp ? new Date(Number(certificate.timestamp) * 1000).toLocaleDateString() : "Unknown"}
        </td>
        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
          <button className="text-primary hover:text-accent mr-2 sm:mr-3">View</button>
          <button className="text-base-content/70 hover:text-base-content">Share</button>
        </td>
      </tr>
    );
  };

  // Get user's name for welcome message
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`
    : user?.name || (address ? `${address.substring(0, 6)}...${address.substring(38)}` : "User");

  // Count verified and pending certificates
  const [verifiedCount, pendingCount] = [0, 0]; // Will be updated when we fetch certificate data

  return (
    <div className="flex-1 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-base-content hidden lg:block">Dashboard</h1>
            <p className="text-sm sm:text-base text-base-content/70 mt-2">
              {userCertificateIds.length > 0
                ? `Welcome back, ${userName}! Here&apos;s an overview of your digital identity proofs.`
                : `Welcome to ProofMint, ${userName}! Get started by creating your first digital proof.`}
            </p>
          </div>
          <button onClick={() => window.location.reload()} className="btn btn-sm btn-ghost">
            <ArrowPathIcon className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="flex flex-col glass p-4 rounded-lg justify-center">
          <div className="flex items-center">
            <div className="p-2 bg-primary/20 backdrop-blur-sm rounded flex-shrink-0">
              <DocumentCheckIcon className="h-8 w-8 text-primary" />
            </div>
            <div className="ml-3 min-w-0">
              <p className="text-xl m-0 font-bold text-base-content">
                {isUserCertificatesLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  userCertificateIds.length
                )}
              </p>
              <p className="text-sm m-0 text-base-content/70 truncate">My Proofs</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col glass p-4 rounded-lg justify-center">
          <div className="flex items-center">
            <div className="p-2 bg-success/20 backdrop-blur-sm rounded flex-shrink-0">
              <ShieldCheckIcon className="h-8 w-8 text-success" />
            </div>
            <div className="ml-3 min-w-0">
              <p className="text-xl m-0 font-bold text-base-content">
                {isUserCertificatesLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  verifiedCount
                )}
              </p>
              <p className="text-sm m-0 text-base-content/90 truncate">Verified</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col glass p-4 rounded-lg justify-center">
          <div className="flex items-center">
            <div className="p-2 bg-warning/20 backdrop-blur-sm rounded flex-shrink-0">
              <BellIcon className="h-7 w-8 text-warning" />
            </div>
            <div className="ml-3 min-w-0">
              <p className="text-xl font-bold m-0 text-base-content">
                {isUserCertificatesLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  pendingCount
                )}
              </p>
              <p className="text-sm m-0 text-base-content/90 truncate">Revoked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Issuer Section */}
      {isIssuer && (
        <div className="mb-8 glass rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-base-content">Issuer Dashboard</h2>
            <Link href="/signup/register-issuer" className="btn btn-sm btn-primary">
              Update Profile
            </Link>
          </div>

          {isIssuerProfileLoading ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner"></span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-base-content/70">Organization</p>
                <p className="font-semibold text-base-content">{issuerProfile?.[0] || "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/70">Certificates Issued</p>
                <p className="font-semibold text-base-content">{issuerProfile?.[2]?.toString() || "0"}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/70">Member Since</p>
                <p className="font-semibold text-base-content">
                  {issuerProfile?.[3] ? new Date(Number(issuerProfile[3]) * 1000).toLocaleDateString() : "Unknown"}
                </p>
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-base-200">
            <Link href="/create" className="btn btn-primary w-full">
              <PlusIcon className="h-5 w-5 mr-2" />
              Create New Certificate
            </Link>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-base-content mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/create"
            className="bg-accent text-accent-content p-4 hover:bg-accent/80 transition-all hover:scale-105 text-center rounded-lg shadow-xl"
          >
            <PlusIcon className="h-8 w-8 mx-auto mb-2" />
            <span className="block font-medium">Create New Proof</span>
          </Link>

          <Link
            href="/verify"
            className="glass text-base-content p-4 hover:shadow-2xl transition-all hover:scale-105 rounded-lg text-center"
          >
            <ShieldCheckIcon className="h-8 w-8 mx-auto mb-2" />
            <span className="block font-medium">Verify Proof</span>
          </Link>

          <Link
            href="/notifications"
            className="glass text-base-content p-4 hover:shadow-2xl transition-all hover:scale-105 rounded-lg text-center"
          >
            <BellIcon className="h-8 w-8 mx-auto mb-2" />
            <span className="block font-medium">View Notifications</span>
          </Link>

          <Link
            href="/profile"
            className="glass text-base-content p-4 hover:shadow-2xl transition-all hover:scale-105 rounded-lg text-center"
          >
            <UserIcon className="h-8 w-8 mx-auto mb-2" />
            <span className="block font-medium">Manage Profile</span>
          </Link>
        </div>
      </div>

      {/* Become an Issuer CTA */}
      {!isIssuer && (
        <div className="mb-8 glass rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-base-content">Become an Issuer</h3>
              <p className="text-base-content/70">Register your organization to start issuing digital certificates</p>
            </div>
            <Link href="/signup/register-issuer" className="btn btn-primary">
              Register as Issuer
            </Link>
          </div>
        </div>
      )}

      {/* Recent Proofs */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-base-content">My Certificates</h2>
          <Link href="/proofs" className="text-primary hover:text-accent text-sm font-medium">
            View all
          </Link>
        </div>

        <div className="glass">
          {isUserCertificatesLoading ? (
            <div className="flex justify-center p-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : userCertificateIds.length === 0 ? (
            <div className="text-center p-8">
              <DocumentCheckIcon className="h-12 w-12 text-base-content/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-base-content mb-2">No certificates yet</h3>
              <p className="text-base-content/70 mb-4">
                You don&apos;t have any certificates. Create your first proof to get started.
              </p>
              <Link href="/create" className="btn btn-primary">
                Create New Proof
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-base-200">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                      Certificate
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                      Issuer
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
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
    </div>
  );
};

export default Dashboard;
