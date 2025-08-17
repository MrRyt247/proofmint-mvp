"use client";

import { useEffect, useState } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaucetButton, RainbowKitCustomConnectButton } from "../../components/scaffold-eth";
import { useUser } from "../../hooks/auth";
import { useTargetNetwork } from "../../hooks/scaffold-eth";
import { hardhat } from "viem/chains";
import { useAccount } from "wagmi";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { targetNetwork } = useTargetNetwork();
  const { isConnected, address } = useAccount();
  const { user, isLoading: isUserLoading } = useUser();
  const router = useRouter();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (user && !isUserLoading) {
      router.push("/dashboard");
    }
  }, [user, isUserLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // In a real app, you would validate credentials against a backend
      if (email && password) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if user is registered
        const userData = localStorage.getItem(`user_${address}`);
        if (userData) {
          // User is registered, redirect to dashboard
          router.push("/dashboard");
        } else {
          // User is not registered, redirect to signup
          router.push("/signup");
        }
      } else {
        setError("Please enter both email and password");
      }
    } catch (err) {
      setError("Invalid email or password");
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking user status
  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-base-content/70">Checking your account...</p>
        </div>
      </div>
    );
  }

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
          <h2 className="text-2xl font-semibold text-base-content mb-6">Welcome Back</h2>
          <p className="text-base-content/70">Sign in to access your digital identity proofs</p>
        </div>

        <div className="glass-card bg-base-100 shadow-xl rounded-lg px-8 py-8">
          {!isConnected ? (
            <div className="text-center py-8">
              <p className="text-base-content/70 mb-6">Please connect your wallet to continue</p>
              <RainbowKitCustomConnectButton />
              {isLocalNetwork && <FaucetButton />}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Enter your email"
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
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input input-bordered w-full pr-10"
                    placeholder="Enter your password"
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

              {error && (
                <div className="alert alert-error">
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-base-content">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link href="/forgot-password" className="text-primary hover:text-accent">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="loading loading-spinner loading-sm mr-2"></span>
                      Signing In...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>

              <div className="text-center">
                <span className="text-base-content/70">Don&apos;t have an account? </span>
                <Link href="/signup" className="text-primary hover:text-accent font-medium">
                  Sign up
                </Link>
              </div>
            </form>
          )}
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

export default SignIn;
