"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../hooks/auth";
import { useAccount } from "wagmi";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();
  const { user, isLoading } = useUser();
  const router = useRouter();

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

  return <>{children}</>;
}
