"use client";

import { useState } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaucetButton, RainbowKitCustomConnectButton } from "../../components/scaffold-eth";
import { useRegisterIssuer } from "../../hooks/proofmint";
import { useTargetNetwork } from "../../hooks/scaffold-eth";
import { hardhat } from "viem/chains";
import { useAccount } from "wagmi";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    isIssuer: false,
    organizationName: "",
    organizationDescription: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisteringIssuer, setIsRegisteringIssuer] = useState(false);
  const { targetNetwork } = useTargetNetwork();
  const { isConnected, address } = useAccount();
  const { registerIssuer } = useRegisterIssuer();
  const router = useRouter();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      return;
    }

    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    // If registering as issuer, validate organization fields
    if (formData.isIssuer && !formData.organizationName.trim()) {
      setError("Organization name is required when registering as an issuer");
      return;
    }

    setIsLoading(true);

    try {
      // For demo purposes, we'll store user data in localStorage
      localStorage.setItem(
        `user_${address}`,
        JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          isIssuer: formData.isIssuer,
        }),
      );

      // If registering as an issuer, call the smart contract
      if (formData.isIssuer) {
        setIsRegisteringIssuer(true);
        try {
          await registerIssuer(formData.organizationName, formData.organizationDescription);
        } catch (err) {
          console.error("Issuer registration error:", err);
          setError("Failed to register as issuer. You can still use the platform as a user.");
        } finally {
          setIsRegisteringIssuer(false);
        }
      }

      // Redirect to dashboard after successful registration
      router.push("/dashboard");
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex flex-col items-center justify-center mb-4">
            <Image src="/Logo.png" alt="ProofMint" width={80} height={80} className="mr-4" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mt-4">
              Proof
              <span className="text-primary-content [text-shadow:0_0_3px_var(--color-primary)]">Mint</span>
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-base-content mb-6">Create Account</h2>
          <p className="text-base-content/70">Join the future of decentralized identity verification</p>
        </div>

        <div className="glass-card shadow-xl rounded-lg px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-base-content/70 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-base-content/70 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-base-content/70 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="john.doe@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-base-content/70 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input input-bordered w-full pr-10"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-base-content/70 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="input input-bordered w-full pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start">
                <input
                  id="isIssuer"
                  name="isIssuer"
                  type="checkbox"
                  checked={formData.isIssuer}
                  onChange={handleInputChange}
                  className="checkbox checkbox-primary checkbox-sm mr-2"
                />
                <span className="label-text text-base-content">Register as an issuer organization</span>
              </label>
            </div>

            {formData.isIssuer && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="organizationName" className="block text-sm font-medium text-base-content/70 mb-2">
                    Organization Name
                  </label>
                  <input
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    required={formData.isIssuer}
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
                    rows={2}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                required
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="checkbox checkbox-primary checkbox-sm"
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-base-content">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:text-accent">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:text-accent">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div>
              <button type="submit" className="btn btn-primary w-full" disabled={!formData.agreeToTerms || isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    {isRegisteringIssuer ? "Registering as Issuer..." : "Creating Account..."}
                  </span>
                ) : formData.isIssuer ? (
                  "Create Account & Register as Issuer"
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            <div className="text-center">
              <span className="text-base-content/70">Already have an account? </span>
              <Link href="/signin" className="text-primary hover:text-accent font-medium">
                Sign in
              </Link>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-base-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-base-100/10 text-base-content/50">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <RainbowKitCustomConnectButton />
              {isLocalNetwork && <FaucetButton />}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-base-content/70 hover:text-base-content">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
