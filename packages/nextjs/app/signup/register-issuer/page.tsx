"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegisterIssuer } from "../../../hooks/proofmint";
import { useAccount } from "wagmi";
import { DocumentCheckIcon, UserGroupIcon } from "@heroicons/react/24/outline";

const RegisterIssuer = () => {
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationDescription: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const { address, isConnected } = useAccount();
  const { registerIssuer } = useRegisterIssuer();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    if (!formData.organizationName.trim()) {
      setError("Organization name is required");
      return;
    }

    setIsLoading(true);

    try {
      await registerIssuer(formData.organizationName, formData.organizationDescription);

      // Update user data in localStorage
      const userDataStr = localStorage.getItem(`user_${address}`);
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        userData.isIssuer = true;
        userData.organizationName = formData.organizationName;
        userData.organizationDescription = formData.organizationDescription;
        localStorage.setItem(`user_${address}`, JSON.stringify(userData));
      }

      setIsRegistered(true);
    } catch (err) {
      console.error("Issuer registration error:", err);
      setError("Failed to register as issuer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-4">
                <DocumentCheckIcon className="h-12 w-12 text-success" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mt-4">
                Proof
                <span className="text-primary-content [text-shadow:0_0_3px_var(--color-primary)]">Mint</span>
              </h1>
            </div>
            <h2 className="text-2xl font-semibold text-base-content mb-6">Registration Successful!</h2>
            <p className="text-base-content/70">You have successfully registered as an issuer organization.</p>
          </div>

          <div className="glass-card shadow-xl rounded-lg px-8 py-8">
            <div className="text-center py-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-base-content mb-2">{formData.organizationName}</h3>
                <p className="text-base-content/70">You can now create and issue certificates to users.</p>
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={() => router.push("/dashboard")} className="btn btn-primary">
                  Go to Dashboard
                </button>
                <Link href="/create" className="btn btn-outline">
                  Create Your First Certificate
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <UserGroupIcon className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mt-4">
              Proof
              <span className="text-primary-content [text-shadow:0_0_3px_var(--color-primary)]">Mint</span>
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-base-content mb-6">Register as Issuer</h2>
          <p className="text-base-content/70">Register your organization to start issuing digital certificates</p>
        </div>

        <div className="glass-card shadow-xl rounded-lg px-8 py-8">
          {!isConnected ? (
            <div className="text-center py-8">
              <p className="text-base-content/70 mb-6">Please connect your wallet to continue</p>
              {/* <w3m-button /> */}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="organizationName" className="block text-sm font-medium text-base-content/70 mb-2">
                  Organization Name
                </label>
                <input
                  id="organizationName"
                  name="organizationName"
                  type="text"
                  required
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="e.g., University of Blockchain"
                />
              </div>

              <div>
                <label
                  htmlFor="organizationDescription"
                  className="block text-sm font-medium text-base-content/70 mb-2"
                >
                  Organization Description
                </label>
                <textarea
                  id="organizationDescription"
                  name="organizationDescription"
                  value={formData.organizationDescription}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered w-full"
                  placeholder="Brief description of your organization..."
                  rows={3}
                />
              </div>

              {error && (
                <div className="alert alert-error">
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="loading loading-spinner loading-sm mr-2"></span>
                      Registering...
                    </span>
                  ) : (
                    "Register as Issuer"
                  )}
                </button>

                <button type="button" onClick={() => router.push("/dashboard")} className="btn btn-outline w-full">
                  Skip for Now
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="text-center">
          <Link href="/dashboard" className="text-base-content/70 hover:text-base-content">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterIssuer;
