"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart2, User, HelpCircle, X, Wallet, LogOut } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

export default function Navbar() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const checkWalletConnection = useCallback(async () => {
    if (!window.arweaveWallet) {
      return;
    }

    try {
      const address = await window.arweaveWallet.getActiveAddress();
      if (address) {
        setWalletAddress(address);
      } else {
        // Only redirect if we're not already on the home page
        if (window.location.pathname !== "/") {
          router.push("/");
        }
      }
    } catch (error) {
      // Only redirect if we're not already on the home page
      if (window.location.pathname !== "/") {
        router.push("/");
      }
    }
  }, [router]);

  useEffect(() => {
    checkWalletConnection();

    // Add event listener for wallet changes
    window.addEventListener("walletSwitch", checkWalletConnection);
    return () => {
      window.removeEventListener("walletSwitch", checkWalletConnection);
    };
  }, [checkWalletConnection]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleDisconnect = async () => {
    try {
      if (window.arweaveWallet) {
        await window.arweaveWallet.disconnect();
        setWalletAddress(null);
        setIsDropdownOpen(false);
        toast({
          title: "Success",
          description: "Wallet disconnected successfully",
        });
        router.push("/");
      }
    } catch (error: any) {
      console.error("Error disconnecting wallet:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to disconnect wallet",
        variant: "destructive",
      });
    }
  };

  const handleNavigation = (path: string) => {
    if (!walletAddress) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      router.push("/");
      return false;
    }
    return true;
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-600 bg-[#241F25] text-[#E4E4E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/pages/main"
                className="text-xl font-bold"
                onClick={(e) => {
                  if (!handleNavigation("/pages/main")) {
                    e.preventDefault();
                  }
                }}
              >
                WORDWEAVE
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              {walletAddress && (
                <div className="relative" ref={dropdownRef}>
                  <Button
                    variant="ghost"
                    className="border-2 border-slate-600 rounded-full hover:bg-slate-800 px-4 py-2 text-sm flex items-center gap-2"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <Wallet className="h-4 w-4" />
                    <span>{formatAddress(walletAddress)}</span>
                  </Button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-black border border-slate-600 overflow-hidden">
                      <Button
                        variant="ghost"
                        className="w-full px-4 py-2 text-sm text-white hover:bg-slate-800 flex items-center gap-2 justify-start"
                        onClick={handleDisconnect}
                      >
                        <LogOut className="h-4 w-4" />
                        Disconnect
                      </Button>
                    </div>
                  )}
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="p-0 border-2 border-slate-600 rounded-full hover:bg-slate-800"
              >
                <Link
                  href="/pages/leaderboard"
                  aria-label="Statistics"
                  onClick={(e) => {
                    if (!handleNavigation("/pages/leaderboard")) {
                      e.preventDefault();
                    }
                  }}
                >
                  <BarChart2 className="h-6 w-6" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="p-0 border-2 border-slate-600 rounded-full hover:bg-slate-800"
              >
                <Link
                  href="/pages/profile"
                  aria-label="Profile"
                  onClick={(e) => {
                    if (!handleNavigation("/pages/profile")) {
                      e.preventDefault();
                    }
                  }}
                >
                  <User className="h-6 w-6" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="p-0 border-2 border-slate-600 rounded-full hover:bg-slate-800"
                onClick={() => setIsHelpOpen(true)}
                aria-label="Help"
              >
                <HelpCircle className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Help Panel */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-50 ${
          isHelpOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsHelpOpen(false)}
      >
        <div
          className={`fixed left-1/2 -translate-x-1/2 w-full max-w-lg bg-black border border-slate-700 rounded-xl p-8 transition-all duration-300 ease-out shadow-xl ${
            isHelpOpen ? "bottom-28 opacity-100" : "-bottom-full opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">How to Play</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsHelpOpen(false)}
              className="hover:bg-gray-800 rounded-full"
            >
              <X className="h-6 w-6 text-gray-400" />
            </Button>
          </div>

          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">Game Rules</h3>
              <p>Guess the word in 6 tries or less.</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Each guess must be a valid 5-letter word</li>
                <li>Colors will show how close your guess was</li>
                <li>Green means the letter is correct and in the right spot</li>
                <li>
                  Yellow means the letter is in the word but in the wrong spot
                </li>
                <li>Gray means the letter is not in the word</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">Getting Started</h3>
              <p>
                Type any five-letter word and press enter to start guessing. Use
                the colors as clues to guess the word within 6 tries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
