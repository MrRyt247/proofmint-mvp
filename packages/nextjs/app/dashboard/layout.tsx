"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../hooks/auth";
import { useAccount } from "wagmi";
import Sidebar from "~~/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  useEffect(() => {
    // Redirect to signin if not connected or not registered
    if (!isLoading && (!isConnected || !user)) {
      router.push("/signin");
    }
  }, [isConnected, user, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading || !isConnected || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="flex flex-1">
      <Sidebar isExpanded={isSidebarExpanded} isMobile={false} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-1">
        <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarExpanded ? "ml-10" : "ml-20"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
