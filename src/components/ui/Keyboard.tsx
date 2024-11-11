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
      return "bg-gray-700 hover:bg-gray-600 text-gray-200";
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
      return "bg-emerald-600 hover:bg-emerald-500 text-white";
    }
    if (isPresent) {
      return "bg-amber-500 hover:bg-amber-400 text-white";
    }
    if (isUsed) {
      return "bg-gray-600 hover:bg-gray-500 text-gray-300";
    }
    return "bg-gray-400 hover:bg-gray-300 text-gray-800";
  };

  return (
    <div className="mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1.5 mb-1.5">
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
                key === "ENTER" || key === "BACKSPACE" ? "w-16" : "w-10"
              } h-14 p-0 rounded-md
                         text-sm font-bold transition-all duration-200 ${getKeyColor(
                           key
                         )}
                         shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
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
