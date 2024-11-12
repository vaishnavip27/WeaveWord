"use client";

import { useState, useEffect } from "react";
import { Grid } from "@/components/ui/Grid";
import { Keyboard } from "@/components/ui/Keyboard";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { WORD_LIST } from "../../../services/wordList";
import { useRouter } from "next/navigation";

import { initializeAO, saveScoreInProcess, fetchPlayerScore } from "@/utils/ao";

export default function MainPage() {
  const router = useRouter();
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">(
    "playing"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [targetWord, setTargetWord] = useState("");
  const [isScoreFetching, setIsScoreFetching] = useState(false);
  const [isSavingScore, setIsSavingScore] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    checkWalletAndStartGame();
  }, []);

  useEffect(() => {
    const initAO = async () => {
      if (walletAddress) {
        await initializeAO(walletAddress);
        const fetchedScore = await fetchPlayerScore();
        setScore(typeof fetchedScore === "number" ? fetchedScore : 0);
      }
    };

    if (walletAddress) {
      initAO();
    }
  }, [walletAddress]);

  const checkWalletAndStartGame = async () => {
    try {
      if (!window.arweaveWallet) {
        router.push("/");
        return;
      }

      const address = await window.arweaveWallet.getActiveAddress();
      if (!address) {
        router.push("/");
        return;
      }
      setWalletAddress(address);
      startNewGame();
    } catch (error) {
      console.error("Wallet check error:", error);
      router.push("/");
    }
  };

  const startNewGame = () => {
    const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    setTargetWord(randomWord);
    setGuesses([]);
    setCurrentGuess("");
    setGameStatus("playing");
  };

  const fetchScore = async () => {
    setIsScoreFetching(true);
    try {
      const fetchedScore = await fetchPlayerScore();
      if (typeof fetchedScore === "number") {
        setScore(fetchedScore);
        toast({
          title: "Score Fetched",
          description: `Your current score is ${fetchedScore}!`,
        });
      } else {
        throw new Error("Invalid score format received");
      }
    } catch (error) {
      console.error("Error fetching score:", error);
      toast({
        title: "Error",
        description: "Failed to fetch score. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScoreFetching(false);
    }
  };

  const saveScore = async () => {
    setIsSavingScore(true);
    try {
      if (walletAddress) {
        await saveScoreInProcess(walletAddress, 100);
        toast({
          title: "Score Saved",
          description: "Your score has been saved successfully!",
        });
      } else {
        throw new Error("Wallet address is not available");
      }
    } catch (error) {
      console.error("Error saving score:", error);
      toast({
        title: "Error",
        description: "Failed to save score. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingScore(false);
    }
  };

  const submitGuess = async () => {
    if (currentGuess.length !== 5 || isLoading) return;

    const guess = currentGuess.toUpperCase();

    if (!WORD_LIST.includes(guess)) {
      toast({
        title: "Invalid Word",
        description: "Word not found in dictionary",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const newGuesses = [...guesses, guess];
      setGuesses(newGuesses);
      setCurrentGuess("");

      const isWon = guess === targetWord;
      const isLost = newGuesses.length >= 6;

      if (isWon) {
        setGameStatus("won");
        toast({
          title: "Congratulations!",
          description: "You've won! 🎉",
        });
      } else if (isLost) {
        setGameStatus("lost");
        toast({
          title: "Game Over",
          description: `The word was ${targetWord}. Better luck next time!`,
        });
      }
    } catch (error) {
      console.error("Error submitting guess:", error);
      toast({
        title: "Error",
        description: "Failed to submit guess. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (gameStatus !== "playing" || isLoading) return;

    if (event.key === "Enter" && currentGuess.length === 5) {
      submitGuess();
    } else if (event.key === "Backspace") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[A-Za-z]$/.test(event.key) && currentGuess.length < 5) {
      setCurrentGuess((prev) => (prev + event.key).toUpperCase());
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, gameStatus, isLoading]);

  if (!walletAddress) {
    return null;
  }

  return (
    <div className=" bg-[#0E0E11] text-[#E4E4E4] flex flex-col items-center justify-center">
      <main className="flex flex-col items-center justify-center w-full max-w-xl mx-auto px-4 py-16 md:py-20 rounded-md">
        <div className="w-full flex justify-end mb-2">
          <div className="bg-gray-900 px-5 py-3 rounded-lg text-sm sm:text-base border border-gray-700">
            <span className="font-bold">Score: </span>
            <span>{score}</span>
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-4">
          <Grid
            guesses={guesses}
            currentGuess={currentGuess}
            gameStatus={gameStatus}
            targetWord={targetWord}
          />
          <Keyboard
            currentGuess={currentGuess}
            setCurrentGuess={setCurrentGuess}
            submitGuess={submitGuess}
            gameStatus={gameStatus}
            isLoading={isLoading}
            guesses={guesses}
            targetWord={targetWord}
          />

          <div className="text-center mt-4 space-x-2">
            {gameStatus === "won" && (
              <Button
                onClick={saveScore}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 md:px-5 md:py-3 text-sm md:text-base"
                disabled={isSavingScore}
              >
                {isSavingScore ? "Saving..." : "Save Score"}
              </Button>
            )}
            <Button
              onClick={startNewGame}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 md:px-5 md:py-3 text-sm md:text-base"
              disabled={isLoading}
            >
              Play Again
            </Button>
            <Button
              onClick={fetchScore}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 md:px-5 md:py-3 text-sm md:text-base"
              disabled={isScoreFetching}
            >
              {isScoreFetching ? "Fetching..." : "Fetch Score"}
            </Button>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-gray-500 text-sm sm:text-base">
        <p>© copyright 2024 | made by vaishnavi</p>
      </footer>
    </div>
  );
}
