import { Button } from "@/components/ui/button";

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

interface KeyboardProps {
  currentGuess: string;
  setCurrentGuess: React.Dispatch<React.SetStateAction<string>>;
  submitGuess: () => void;
  gameStatus: "playing" | "won" | "lost";
  isLoading?: boolean;
  guesses?: string[];
  targetWord?: string;
}

export const Keyboard: React.FC<KeyboardProps> = ({
  currentGuess,
  setCurrentGuess,
  submitGuess,
  gameStatus,
  isLoading = false,
  guesses = [],
  targetWord = "",
}) => {
  const getKeyColor = (key: string): string => {
    if (key === "ENTER" || key === "BACKSPACE") {
      return "bg-gray-600 hover:bg-gray-500";
    }

    let isCorrect = false;
    let isPresent = false;
    let isUsed = false;

    const targetLetterCount = (
      targetWord.toUpperCase().match(new RegExp(key, "g")) || []
    ).length;

    guesses.forEach((guess) => {
      const upperGuess = guess.toUpperCase();

      [...upperGuess].forEach((letter, index) => {
        if (letter === key) {
          isUsed = true;

          if (targetWord.toUpperCase()[index] === key) {
            isCorrect = true;
            return;
          }

          if (targetWord.toUpperCase().includes(key)) {
            const lettersBefore = upperGuess
              .slice(0, index + 1)
              .split("")
              .filter((l) => l === key).length;
            if (lettersBefore <= targetLetterCount) {
              isPresent = true;
            }
          }
        }
      });
    });

    if (isCorrect) {
      return "bg-[#6D994A] hover:bg-[##16a34a] text-white"; // Green for correct
    }
    if (isPresent) {
      return "bg-[#695FA3] hover:bg-[##5749a6] text-white"; // Yellow for present
    }
    if (isUsed) {
      return "bg-[#1f1f1f] hover:bg-gray-600 text-gray-300 border border-slate-700"; // Gray for used but not in word
    }
    return "bg-[#3C373D] hover:bg-gray-500"; // Default color
  };

  return (
    <div className="mb-2">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 mb-2">
          {row.map((key) => (
            <Button
              key={key}
              onClick={() => {
                if (isLoading) return;

                if (key === "ENTER") {
                  if (currentGuess.length === 5) submitGuess();
                } else if (key === "BACKSPACE") {
                  setCurrentGuess((prev) => prev.slice(0, -1));
                } else {
                  setCurrentGuess((prev) => (prev + key).slice(0, 5));
                }
              }}
              className={`${
                key === "ENTER" || key === "BACKSPACE" ? "w-36" : "w-28"
              } h-14 p-0 
                         text-sm font-semibold transition-colors duration-200 ${getKeyColor(
                           key
                         )}`}
              disabled={gameStatus !== "playing" || isLoading}
            >
              {key === "BACKSPACE" ? "←" : key}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
};
