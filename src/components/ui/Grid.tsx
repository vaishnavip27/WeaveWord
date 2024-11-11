import React from "react";

type LetterState = "correct" | "present" | "absent" | "empty";

interface GridProps {
  guesses: string[];
  currentGuess: string;
  gameStatus: "playing" | "won" | "lost";
  targetWord: string;
}

const getLetterState = (
  letter: string,
  position: number,
  guess: string,
  targetWord: string
): LetterState => {
  if (!letter) return "empty";

  const targetArray = targetWord.split("");
  const guessArray = guess.split("");

  // First, mark all correct positions
  if (targetWord[position] === letter) {
    return "correct";
  }

  // If not correct, check if it's present elsewhere
  // Count how many times this letter appears in the target
  const letterCount = targetArray.filter((l) => l === letter).length;

  // Count how many times this letter is correctly placed before this position
  const correctPlacements = guessArray
    .slice(0, position)
    .filter((l, i) => l === letter && targetArray[i] === letter).length;

  // Count how many times this letter has been marked as present before this position
  const presentPlacements = guessArray
    .slice(0, position)
    .filter(
      (l, i) =>
        l === letter && targetArray[i] !== letter && targetArray.includes(l)
    ).length;

  // If the letter exists in target word and we haven't exceeded the total count
  if (
    targetWord.includes(letter) &&
    correctPlacements + presentPlacements < letterCount
  ) {
    return "present";
  }

  return "absent";
};

const getBackgroundColor = (state: LetterState): string => {
  switch (state) {
    case "correct":
      return "#6D994A";
    case "present":
      return "#695FA3";
    case "absent":
      return "#3C373D";
    default:
      return "#1a1a1a";
  }
};

const getBorderColor = (state: LetterState): string => {
  switch (state) {
    case "correct":
      return "#16a34a";
    case "present":
      return "#5749a6";
    case "absent":
      return "#3C373D";
    default:
      return "#333333";
  }
};

export const Grid: React.FC<GridProps> = ({
  guesses,
  currentGuess,
  gameStatus,
  targetWord,
}) => {
  const remainingRows = Math.max(
    0,
    6 - guesses.length - (gameStatus === "playing" ? 1 : 0)
  );
  const currentGuessArray = currentGuess.split("");
  const remainingCurrentGuessArray = Array(5 - currentGuessArray.length).fill(
    ""
  );

  return (
    <div
      style={{
        display: "inline-block",
        width: "fit-content",
        margin: "0 auto",
        marginLeft: "630px",
      }}
    >
      {/* Previous guesses */}
      {guesses.map((guess, i) => (
        <div
          key={i}
          style={{ display: "flex", gap: "3px", marginBottom: "3px" }}
        >
          {guess.split("").map((letter, j) => {
            const state = getLetterState(letter, j, guess, targetWord);
            return (
              <div
                key={`${i}-${j}`}
                style={{
                  width: "68px",
                  height: "68px",
                  border: `2px solid ${getBorderColor(state)}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  backgroundColor: getBackgroundColor(state),
                  color: "white",
                  transition:
                    "background-color 0.3s ease, border-color 0.3s ease",
                }}
              >
                {letter}
              </div>
            );
          })}
        </div>
      ))}

      {/* Current guess */}
      {gameStatus === "playing" && (
        <div style={{ display: "flex", gap: "3px", marginBottom: "3px" }}>
          {currentGuessArray.map((letter, i) => (
            <div
              key={`current-${i}`}
              style={{
                width: "68px",
                height: "68px",
                border: "2px solid #333",
                display: "flex",
                alignItems: "center",
                borderColor: "6px",
                justifyContent: "center",
                fontSize: "1.5rem",
                borderRadius: "6px",
                fontWeight: "bold",
                textTransform: "uppercase",
                backgroundColor: "#1a1a1a",
                color: "white",
              }}
            >
              {letter}
            </div>
          ))}
          {remainingCurrentGuessArray.map((_, i) => (
            <div
              key={`remaining-${i}`}
              style={{
                width: "68px",
                height: "68px",
                border: "2px solid #333",
                display: "flex",
                alignItems: "center",
                borderColor: "6px",
                justifyContent: "center",
                fontSize: "1.5rem",
                borderRadius: "6px",
                fontWeight: "bold",
                textTransform: "uppercase",
                backgroundColor: "#514E52",
                color: "white",
              }}
            >
              {" "}
            </div>
          ))}
        </div>
      )}

      {/* Empty rows */}
      {Array(remainingRows)
        .fill("")
        .map((_, i) => (
          <div
            key={`empty-row-${i}`}
            style={{ display: "flex", gap: "3px", marginBottom: "3px" }}
          >
            {Array(5)
              .fill("")
              .map((_, j) => (
                <div
                  key={`empty-${i}-${j}`}
                  style={{
                    width: "68px",
                    height: "68px",
                    border: "2px solid #333",
                    display: "flex",
                    borderColor: "6px",
                    borderRadius: "6px",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    backgroundColor: "#514E52",
                    color: "white",
                  }}
                >
                  {" "}
                </div>
              ))}
          </div>
        ))}

      {gameStatus === "lost" && (
        <div
          style={{
            marginTop: "1rem",
            textAlign: "center",
            color: "#ef4444",
            fontSize: "1.25rem",
            fontWeight: "bold",
          }}
        >
          The word was: {targetWord}
        </div>
      )}
    </div>
  );
};

export default Grid;
