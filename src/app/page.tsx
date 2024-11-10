/// <reference types="@types/arconnect" />

"use client";

import GameName from "../components/ui/gameName";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    disconnectWallet();
  }, []);

  const disconnectWallet = async () => {
    try {
      if (window.arweaveWallet) {
        await window.arweaveWallet.disconnect();
        console.log("Wallet disconnected successfully");
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);

      if (!window.arweaveWallet) {
        console.log("ArConnect not found");
        toast({
          title: "ArConnect Not Found",
          description: "Please install ArConnect to continue",
          variant: "destructive",
        });
        window.open("https://arconnect.io", "_blank");
        return;
      }

      // Connect wallet with necessary permissions
      await window.arweaveWallet.connect([
        "ACCESS_ADDRESS",
        "SIGN_TRANSACTION",
        "DISPATCH",
        "ACCESS_PUBLIC_KEY",
      ]);

      const address = await window.arweaveWallet.getActiveAddress();

      if (!address) {
        throw new Error("No wallet address found");
      }

      console.log("Wallet connected successfully:", address);

      toast({
        title: "Success",
        description: "Wallet connected successfully!",
      });

      // Navigate to main page
      setTimeout(() => {
        router.push("/pages/main");
      }, 1000);
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Error",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
      await disconnectWallet();
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className=" w-full flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 flex-col bg-[#241F25] text-[#E4E4E4] border border-white mt-10">
      <div className="w-full max-w-md  flex items-center justify-center">
        <GameName />
      </div>
      <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-20 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">
          Hey People!
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-1">
          Ready to test your word skills
        </p>
        <p className="text-lg sm:text-xl md:text-2xl">on the blockchain?</p>
      </div>
      <Button
        className={`mt-14 sm:mt-8 md:mt-10 px-6 py-6 text-sm sm:text-base md:text-lg font-medium rounded-full bg-slate-50 text-black hover:bg-slate-200 transition-colors duration-200
          ${isConnecting ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={connectWallet}
        disabled={isConnecting}
      >
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    </div>
  );
}
