"use client";

import { useState } from "react";
import { useUser } from "../../hooks/auth";
import { useScaffoldReadContract } from "../../hooks/scaffold-eth";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { BuildingOfficeIcon, CalendarIcon, UserIcon } from "@heroicons/react/24/outline";

const Profile = () => {
  const { address, isConnected } = useAccount();
  const { user } = useUser();

  // Get issuer profile if user is an issuer
  const { data: issuerProfile } = useScaffoldReadContract({
    contractName: "ProofMint",
    functionName: "issuerProfiles",
    args: [address as Address],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: "",
  });

  if (!isConnected) {
    return (
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-8">
        <div className="glass-card rounded-lg shadow-sm p-8 text-center">
          <UserIcon className="h-16 w-16 text-base-content/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-base-content mb-4">Profile</h2>
          <p className="text-base-content/70 mb-6">Please connect your wallet to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-8">
      <div className="glass-card rounded-lg shadow-sm p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-base-content">Profile</h1>
          <button onClick={() => setIsEditing(!isEditing)} className="btn btn-sm btn-outline">
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <div className="space-y-6">
          {/* Wallet Information */}
          <div className="border-b border-base-200 pb-6">
            <h2 className="text-lg font-semibold text-base-content mb-4">Wallet Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-base-content/70">Wallet Address</p>
                <p className="font-mono text-sm bg-base-200 p-2 rounded break-all">{address}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/70">Connected Status</p>
                <p className="text-success flex items-center">
                  <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
                  Connected
                </p>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="border-b border-base-200 pb-6">
            <h2 className="text-lg font-semibold text-base-content mb-4">User Information</h2>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-base-content/70 mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={profileData.name}
                    onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                    className="input input-bordered w-full"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-base-content/70 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                    className="input input-bordered w-full"
                    placeholder="your.email@example.com"
                  />
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    // In a real app, you would save this data
                    setIsEditing(false);
                  }}
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-base-content/70">Name</p>
                  <p className="font-semibold text-base-content">{user?.name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Member Since</p>
                  <p className="text-base-content">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>

          {/* Issuer Information */}
          <div>
            <h2 className="text-lg font-semibold text-base-content mb-4">Issuer Information</h2>
            {issuerProfile && issuerProfile[0] && issuerProfile[0] !== "" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-base-content flex items-center">
                    <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                    {issuerProfile[0]}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Certificates Issued</p>
                  <p className="font-semibold text-base-content">{issuerProfile[2]?.toString() || "0"}</p>
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Member Since</p>
                  <p className="text-base-content flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {issuerProfile[3] ? new Date(Number(issuerProfile[3]) * 1000).toLocaleDateString() : "Unknown"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <BuildingOfficeIcon className="h-12 w-12 text-base-content/30 mx-auto mb-4" />
                <p className="text-base-content/70 mb-4">You are not registered as an issuer yet.</p>
                <a href="/signup/register-issuer" className="btn btn-primary">
                  Register as Issuer
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
