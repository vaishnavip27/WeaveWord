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
        <div
          className="mb-8 text-4xl font-black sm:text-5xl md:text-6xl bg-gradient-to-r from-[#3fb48f] to-[#5e51a5] text-transparent bg-clip-text"
          style={{
            textShadow:
              "0px 0px 8px rgba(89, 161, 133, 0.3), 0px 0px 12px rgba(105, 95, 163, 0.3)",
          }}
        >
          WORDWEAVE
        </div>
        <h1 className="mb-4 text-xl font-semibold sm:text-2xl md:text-3xl lg:text-4xl">
          Hey WordWeavers!
        </h1>
        <p className="mb-1 text-lg sm:text-xl md:text-2xl lg:text-2xl font-semibold mt-7">
          Ready to test your word skills
        </p>
        <p className="mb-8 text-lg sm:text-xl md:text-2xl lg:text-2xl font-semibold">
          on the Arweave?
        </p>
        <Button
          className={`relative rounded-full px-5 py-4 min-h-[60px] text-base font-medium text-black bg-slate-50 transition duration-200 hover:bg-slate-200 sm:px-8 sm:py-4 sm:text-lg md:px-10 md:py-5 md:text-xl button-with-shine ${
            isConnecting ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      </div>

      {/* Shine border animation CSS */}
      <style jsx>{`
        .button-with-shine {
          position: relative;
          overflow: hidden;
          border: 2px solid transparent;
          border-radius: 9999px;
        }
        .button-with-shine::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0) 30%,
            rgba(255, 255, 255, 0.8),
            rgba(255, 255, 255, 0) 70%
          );
          transform: rotate(45deg);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .button-with-shine:hover::before {
          opacity: 1;
          animation: shine 1.5s linear infinite;
        }
        @keyframes shine {
          0% {
            transform: translateX(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) rotate(45deg);
          }
        }
      `}</style>
    </div>
  );
}
