import { useEffect, useState } from "react";
import { useIsIssuer } from "./proofmint";
import { useScaffoldReadContract } from "./scaffold-eth";
import { useAccount } from "wagmi";

// User type definition
export type User = {
  address: string;
  isRegistered: boolean;
  isIssuer: boolean;
  name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
};

// Hook to get current user information
export const useUser = () => {
  const { address, isConnected } = useAccount();
  const { isIssuer } = useIsIssuer();

  // Get issuer profile if user is an issuer
  const { data: issuerProfile, isLoading: isIssuerProfileLoading } = useScaffoldReadContract({
    contractName: "ProofMint",
    functionName: "issuerProfiles",
    args: [address as `0x${string}`],
  });

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isConnected || !address) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    // Check if user is registered in localStorage
    const userDataStr = localStorage.getItem(`user_${address}`);
    let userData: User | null = null;

    if (userDataStr) {
      try {
        const parsedData = JSON.parse(userDataStr);
        userData = {
          address,
          isRegistered: true,
          isIssuer: isIssuer || false,
          name: issuerProfile?.[0] || parsedData.organizationName || undefined,
          email: parsedData.email || undefined,
          firstName: parsedData.firstName || undefined,
          lastName: parsedData.lastName || undefined,
        };
      } catch (e) {
        console.error("Error parsing user data:", e);
        // Fallback to basic user data
        userData = {
          address,
          isRegistered: true,
          isIssuer: isIssuer || false,
          name: issuerProfile?.[0] || undefined,
        };
      }
    } else {
      // User not in localStorage but has a wallet connected
      userData = {
        address,
        isRegistered: false,
        isIssuer: isIssuer || false,
        name: issuerProfile?.[0] || undefined,
      };
    }

    setUser(userData);
    setIsLoading(false);
  }, [address, isConnected, isIssuer, issuerProfile]);

  return { user, isLoading };
};

// Hook for user authentication
export const useAuth = () => {
  const { user, isLoading } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsAuthenticated(!!user && user.isRegistered);
    }
  }, [user, isLoading]);

  const login = () => {
    // In a real implementation, you would handle actual authentication
    // For now, we'll just check if the user is connected and registered
    return !!user && user.isRegistered;
  };

  const logout = () => {
    // In a real implementation, you would handle actual logout
    // For now, we'll just clear local storage
    localStorage.clear();
  };

  return { user, isAuthenticated, isLoading, login, logout };
};
