"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { hardhat } from "viem/chains";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import Sidebar from "~~/components/Sidebar";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Debug Contracts",
    href: "/debug",
    icon: <BugAntIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
        <div className="navbar-start w-auto lg:w-1/2">
          <button className="ml-1 btn btn-ghost lg:hidden hover:bg-transparent" onClick={toggleSidebar}>
            <Bars3Icon className="h-1/2" />
          </button>
          <Link href="/" passHref className="hidden sm:flex items-center gap-2 ml-4 mr-6 shrink-0">
            <div className="flex items-center">
              <Image src="/Logo_coloured-outline.svg" alt="ProofMint" width={32} height={32} className="mr-2" />
              <span className="text-xl font-bold">
                <span className="text-primary">Proof</span>
                <span className="text-accent">Mint</span>
              </span>
            </div>
          </Link>
          <ul className="hidden sm:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
            <HeaderMenuLinks />
          </ul>
        </div>
        <div className="navbar-end grow mr-4">
          <RainbowKitCustomConnectButton />
          {isLocalNetwork && <FaucetButton />}
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && <Sidebar isExpanded={true} isMobile={true} toggleSidebar={toggleSidebar} />}
    </>
  );
};
