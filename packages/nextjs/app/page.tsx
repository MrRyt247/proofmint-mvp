"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import {
  ArrowRightIcon,
  CheckIcon,
  DocumentCheckIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  StarIcon,
  UserGroupIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const features = [
    {
      icon: DocumentCheckIcon,
      title: "Digital Proof Creation",
      description:
        "Create verifiable digital proofs of your credentials, achievements, and identity documents with blockchain security.",
    },
    {
      icon: LockClosedIcon,
      title: "Secure & Private",
      description: "Your data is encrypted and stored securely. You control what information to share and with whom.",
    },
    {
      icon: ShieldCheckIcon,
      title: "Instant Verification",
      description: "Verify credentials instantly without revealing personal information. Trust through cryptography.",
    },
    {
      icon: UserPlusIcon,
      title: "NFT Minting",
      description: "Transform your proofs into NFTs for permanent, tamper-proof records on the blockchain.",
    },
    {
      icon: GlobeAltIcon,
      title: "Universal Access",
      description: "Access your credentials anywhere in the world. Cross-border verification made simple.",
    },
    {
      icon: UserGroupIcon,
      title: "Trusted Network",
      description: "Join a growing network of verified individuals and organizations building digital trust.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "University Student",
      content:
        "ProofMint made it so easy to verify my degree for job applications. The process was seamless and instant!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "HR Director",
      content:
        "We've streamlined our hiring process significantly. Verifying candidate credentials has never been easier.",
      rating: 5,
    },
    {
      name: "Lisa Rodriguez",
      role: "Freelance Designer",
      content: "Having my certifications as NFTs gives me confidence when pitching to new clients. It's the future!",
      rating: 5,
    },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/40 to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Image src="/Logo.png" alt="ProofMint" width={100} height={100} className="mr-4" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6">
              Proof
              <span className="text-primary-content [text-shadow:0_0_3px_var(--color-primary)]">Mint</span>
            </h1>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-base-content mb-6">
              Decentralized Identity
              <br />
              <span className="text-primary">Verification Platform</span>
            </h2>
            <p className="text-xl text-base-content/70 mb-8 max-w-3xl mx-auto">
              Create, mint, and verify digital identity proofs on the blockchain. Build trust in a decentralized world
              with cryptographic proof of credentials.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {connectedAddress ? (
                <Link href="/dashboard" className="btn btn-primary btn-lg">
                  Go to Dashboard
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </Link>
              ) : (
                <>
                  <Link href="/signup" className="btn btn-primary btn-lg">
                    Get Started
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </Link>
                  <Link href="/signin" className="btn btn-outline btn-lg">
                    Sign In
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-base-content/50">
              <div className="flex items-center">
                <CheckIcon className="h-4 w-4 text-primary mr-1" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="h-4 w-4 text-primary mr-1" />
                <span>Open source</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="h-4 w-4 text-primary mr-1" />
                <span>Community driven</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-4">
              Powerful Features for Digital Identity
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Everything you need to create, manage, and verify digital credentials securely on the blockchain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="glass p-6 hover:shadow-2xl transition-all hover:scale-105 rounded-lg">
                  <div className="w-12 h-12 bg-primary/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-base-content mb-2">{feature.title}</h3>
                  <p className="text-base-content/70">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-4">How ProofMint Works</h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Get started with digital identity verification in just a few simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Connect Wallet",
                description: "Connect your Web3 wallet to get started with ProofMint",
              },
              {
                step: 2,
                title: "Create Proof",
                description: "Upload and create cryptographic proofs of your credentials",
              },
              { step: 3, title: "Mint NFT", description: "Mint your proof as an NFT on the blockchain for permanence" },
              {
                step: 4,
                title: "Share & Verify",
                description: "Share proofs with others who can verify them instantly",
              },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-content font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-base-content mb-2">{item.title}</h3>
                <p className="text-base-content/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-base-content/70">See what our users have to say about ProofMint</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-base-content/80 mb-4 italic">{testimonial.content}</p>
                <div>
                  <p className="font-semibold text-base-content">{testimonial.name}</p>
                  <p className="text-sm text-base-content/70">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-primary-content/80 mb-8 max-w-3xl mx-auto">
            Join thousands of users who trust ProofMint for their digital identity verification needs.
          </p>
          <Link href="/signup" className="btn btn-secondary btn-lg">
            Create Your Account
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-300 text-base-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-4">
                <Image src="/Logo_white-outline.svg" alt="ProofMint" width={32} height={32} className="mr-2" />
                <span className="text-xl font-bold">
                  <span className="text-primary">Proof</span>
                  <span className="text-accent">Mint</span>
                </span>
              </div>
              <p className="text-base-content/70 mb-4">
                Decentralized identity verification platform built for the future of digital trust.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-base-content/70 hover:text-base-content transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-base-content/70 hover:text-base-content transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
                <a href="#" className="text-base-content/70 hover:text-base-content transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-base-content uppercase tracking-wider mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-base-content/70 hover:text-base-content transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base-content/70 hover:text-base-content transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base-content/70 hover:text-base-content transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-base-content uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-base-content/70 hover:text-base-content transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base-content/70 hover:text-base-content transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base-content/70 hover:text-base-content transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base-content/70 hover:text-base-content transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-base-content uppercase tracking-wider mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-base-content/70 hover:text-base-content transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base-content/70 hover:text-base-content transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base-content/70 hover:text-base-content transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base-content/70 hover:text-base-content transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-base-content/10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-base-content/50 text-sm">© 2024 ProofMint. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-base-content/70 hover:text-base-content text-sm transition-colors">
                  Status
                </a>
                <a href="#" className="text-base-content/70 hover:text-base-content text-sm transition-colors">
                  Security
                </a>
                <a href="#" className="text-base-content/70 hover:text-base-content text-sm transition-colors">
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
