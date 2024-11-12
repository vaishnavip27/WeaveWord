"use client";

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
    <div className="flex min-h-screen items-center justify-center bg-[#0E0E11] p-4">
      <div className="max-w-md text-center text-[#E4E4E4]">
        <div className="mb-8 text-4xl font-black sm:text-5xl md:text-6xl">
          WORDWEAVE
        </div>
        <h1 className="mb-4 text-xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl">
          Hey People!
        </h1>
        <p className="mb-1 text-lg sm:text-xl md:text-2xl lg:text-2xl font-semibold mt-6">
          Ready to test your word skills
        </p>
        <p className="mb-8 text-lg sm:text-xl md:text-2xl lg:text-2xl font-semibold">
          on the Arweave?
        </p>
        <Button
          className={`rounded-full bg-slate-50 px-5 py-4 text-base font-medium text-black transition-colors duration-200 hover:bg-slate-200 sm:px-8 sm:py-4 sm:text-lg md:px-10 md:py-5 md:text-xl ${
            isConnecting ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      </div>
    </div>
  );
}
