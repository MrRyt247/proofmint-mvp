"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "../hooks/auth";
import { RainbowKitCustomConnectButton } from "./scaffold-eth";
import { useAccount, useDisconnect } from "wagmi";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/#features" },
  { name: "How it Works", href: "/#how-it-works" },
  { name: "Reviews", href: "/#testimonials" },
];

const userNavigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Create Proof", href: "/create" },
  { name: "Verify Proof", href: "/verify" },
  { name: "Profile", href: "/profile" },
  { name: "Settings", href: "/settings" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { user } = useUser();

  const handleSignOut = () => {
    disconnect();
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full glass z-50 border-b border-base-content/20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center">
            <Image src="/Logo_coloured-outline.svg" alt="ProofMint" width={32} height={32} className="mr-2" />
            <span className="text-xl font-bold">
              <span className="text-primary">Proof</span>
              <span className="text-accent">Mint</span>
            </span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-base-content"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-semibold leading-6 transition-colors ${
                  isActive ? "text-primary" : "text-base-content/70 hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-x-4">
          {isConnected && user ? (
            <>
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-8">
                    <span className="text-xs">{user?.name ? user.name.charAt(0) : address?.slice(0, 2)}</span>
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                >
                  {userNavigation.map(item => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={pathname === item.href ? "active" : ""}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                  <li className="border-t border-base-200 mt-2 pt-2">
                    <button onClick={handleSignOut}>Sign out</button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <Link href="/signin" className="text-sm font-semibold leading-6 text-base-content/70 hover:text-primary">
                Sign in
              </Link>
              <Link href="/signup" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
          <RainbowKitCustomConnectButton />
        </div>
      </nav>
      {/* Mobile menu */}
      <div className={`lg:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 z-50"></div>
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-base-100 px-4 py-6 sm:max-w-sm sm:ring-1 sm:ring-base-200">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center">
              <Image src="/Logo_coloured-outline.svg" alt="ProofMint" width={32} height={32} className="mr-2" />
              <span className="text-xl font-bold">
                <span className="text-primary">Proof</span>
                <span className="text-accent">Mint</span>
              </span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-base-content"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-base-200">
              <div className="space-y-2 py-6">
                {navigation.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-base-content hover:bg-base-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {isConnected && user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-x-2">
                      <div className="bg-neutral text-neutral-content rounded-full w-8 h-8 flex items-center justify-center">
                        <span className="text-xs">{user?.name ? user.name.charAt(0) : address?.slice(0, 2)}</span>
                      </div>
                      <span className="text-sm font-medium">
                        {user?.name || address?.slice(0, 6) + "..." + address?.slice(-4)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {userNavigation.map(item => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                            pathname === item.href
                              ? "text-primary bg-primary/10"
                              : "text-base-content hover:bg-base-200"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 text-base-content hover:bg-base-200"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/signin"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-base-content hover:bg-base-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link href="/signup" className="btn btn-primary w-full" onClick={() => setMobileMenuOpen(false)}>
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
