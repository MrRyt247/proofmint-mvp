"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  CogIcon,
  HomeIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  isExpanded: boolean;
  isMobile?: boolean;
  toggleSidebar?: () => void;
}

const Sidebar = ({ isExpanded, isMobile = false, toggleSidebar }: SidebarProps) => {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: HomeIcon, label: "Dashboard" },
    { href: "/create", icon: PlusIcon, label: "Create Proof" },
    { href: "/verify", icon: ShieldCheckIcon, label: "Verify Proof" },
    { href: "/notifications", icon: BellIcon, label: "Notifications" },
    { href: "/profile", icon: UserIcon, label: "Profile" },
    { href: "/settings", icon: CogIcon, label: "Settings" },
  ];

  // For screens wider than 720px, we show the desktop sidebar
  // For screens narrower than 720px, we show the mobile sidebar when isMobile is true
  return (
    <>
      {/* Mobile sidebar - only shown when isMobile is true and screen is small */}
      {isMobile && (
        <div className="fixed inset-y-0 left-0 z-40 lg:hidden">
          <div
            className={`absolute inset-y-0 left-0 w-64 bg-base-100 transform transition-transform duration-300 ease-in-out ${isMobile ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-base-content"
                onClick={toggleSidebar}
              >
                <XMarkIcon className="h-6 w-6 text-base-content" />
              </button>
            </div>
            <div
              className={`w-64 glass-subtle bg-base-100/90 backdrop-blur-lg shadow-xl min-h-screen transition-all duration-300 ease-in-out relative border-r border-base-content/20`}
            >
              <div className="p-6 transition-all">
                <div className="flex items-center justify-center">
                  <Image
                    src="/Logo_coloured-outline.svg"
                    alt="ProofMint"
                    width={40}
                    height={40}
                    className="mr-3 transition-all"
                  />
                  <h1 className="text-2xl font-bold text-base-content">
                    <span className="text-primary">Proof</span>
                    <span className="text-accent">Mint</span>
                  </h1>
                </div>
              </div>

              <nav className="mt-8">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center px-6 py-3 text-base-content relative group ${
                        isActive
                          ? "bg-primary/10 border-r-2 border-primary"
                          : "hover:bg-base-200/50 hover:text-base-content"
                      }`}
                      onClick={toggleSidebar}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* 
        Desktop sidebar - shown on screens wider than 720px
        On smaller screens, this will be hidden by CSS unless explicitly needed
      */}
      <div
        className={`hidden md:block fixed top-0 left-0 ${isExpanded ? "w-48" : "w-20"} glass-subtle bg-base-100/90 backdrop-blur-lg shadow-xl min-h-screen transition-all duration-300 ease-in-out relative border-r border-base-content/20`}
      >
        {/* Toggle button for desktop */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-4 top-8 bg-primary hover:bg-accent text-primary-content rounded-full p-2 shadow-lg transition-colors z-10"
        >
          {isExpanded ? <ChevronDoubleLeftIcon className="w-4 h-4" /> : <ChevronDoubleRightIcon className="w-4 h-4" />}
        </button>

        <nav className="mt-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center ${isExpanded ? "px-6" : "px-4 justify-center"} py-3 text-base-content hover:bg-base-200/50 hover:text-base-content relative group ${
                  isActive ? "bg-primary/10 text-base-content border-r-2 border-primary" : ""
                }`}
                title={!isExpanded ? item.label : ""}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isExpanded && <span className="ml-3">{item.label}</span>}
                {!isExpanded && (
                  <span className="absolute left-full ml-2 px-2 py-1 bg-base-300 text-base-content text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
