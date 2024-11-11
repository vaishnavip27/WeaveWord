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
    if (walletAddress) {
      console.log("Updated walletAddress:", walletAddress);
    }
  }, [walletAddress]);

  useEffect(() => {
    const initAO = async () => {
      if (walletAddress) {
        await initializeAO(walletAddress);
        const fetchedScore = await fetchPlayerScore();
        console.log(fetchedScore);
        // Fix: Ensure fetchedScore is a number, or provide a default value
        setScore(typeof fetchedScore === 'number' ? fetchedScore : 0);
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
      console.log(address);
      setWalletAddress(address);
      console.log(walletAddress);
      startNewGame();
    } catch (error) {
      console.error("Wallet check error:", error);
      router.push("/");
    }
  };



  const startNewGame = () => {
    const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    console.log("Target Word:", randomWord); // For testing
    setTargetWord(randomWord);
    setGuesses([]);
    setCurrentGuess("");
    setGameStatus("playing");
  };

  const fetchScore = async () => {
    setIsScoreFetching(true);
    try {
      const fetchedScore = await fetchPlayerScore();

      // Ensure the fetched score is a number
      if (typeof fetchedScore === 'number') {
        setScore(fetchedScore);
        console.log("Score:", fetchedScore);
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
      // Fix: Check if walletAddress is not null before using it
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
        await storeGameResult(true, newGuesses.length);
        toast({
          title: "Congratulations!",
          description: "You've won! 🎉",
        });
      } else if (isLost) {
        setGameStatus("lost");
        await storeGameResult(false, 6);
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

  const storeGameResult = async (won: boolean, guessCount: number) => {
    if (!walletAddress) return;

    try {
      const data = {
        word: targetWord,
        won,
        guesses: guessCount,
        timestamp: Date.now(),
      };

      console.log("Storing game result:", data);
    } catch (error) {
      console.error("Error storing game result:", error);
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
    <div className="min-h-screen bg-[#241F25] text-[#E4E4E4] flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center w-full mx-auto px-4 py-8">
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <div className="w-full flex justify-end mb-2">
            <div className="bg-gray-700 px-4 py-2 rounded-lg">
              <span className="font-bold">Score: </span>
              <span>{score}</span>
            </div>
          </div>

          <div className="w-full">
            <Grid
              guesses={guesses}
              currentGuess={currentGuess}
              gameStatus={gameStatus}
              targetWord={targetWord}
            />
          </div>

          <div className="w-full">
            <Keyboard
              currentGuess={currentGuess}
              setCurrentGuess={setCurrentGuess}
              submitGuess={submitGuess}
              gameStatus={gameStatus}
              isLoading={isLoading}
              guesses={guesses}
              targetWord={targetWord}
            />
          </div>

          <div className="text-center mt-4 space-x-3">
            {gameStatus === "won" && (
              <Button
                onClick={saveScore}
                className="bg-gray-700 hover:bg-gray-600 px-5 py-3"
                disabled={isSavingScore}
              >
                {isSavingScore ? "Saving..." : "Save Score"}
              </Button>
            )}
            <Button
              onClick={startNewGame}
              className="bg-gray-700 hover:bg-gray-600 px-5 py-3"
              disabled={isLoading}
            >
              Play Again
            </Button>
            <Button
              onClick={fetchScore}
              className="bg-gray-700 hover:bg-gray-600 px-5 py-3"
              disabled={isScoreFetching}
            >
              {isScoreFetching ? "Fetching..." : "Fetch Score"}
            </Button>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-gray-400">
        <p>Built by Vaishnavi</p>
      </footer>
    </div>
  );
}
