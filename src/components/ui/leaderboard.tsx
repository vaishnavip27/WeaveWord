// components/Leaderboard.tsx
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { fetchPlayerScore } from "@/utils/ao";

interface PlayerScore {
  player: string;
  score: number;
  timestamp: number;
}

export function Leaderboard() {
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    try {
      setIsLoading(true);
      const fetchedScores = await fetchPlayerScore();
      // Sort scores in descending order
      const sortedScores = fetchedScores.sort((a, b) => b.score - a.score);
      setScores(sortedScores);
    } catch (error) {
      console.error("Error loading scores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatWalletAddress = (address: string) => {
    if (address.length > 12) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return address;
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-2xl">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading scores...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-right">Played On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map((score, index) => (
                <TableRow key={`${score.player}-${score.timestamp}`}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{formatWalletAddress(score.player)}</TableCell>
                  <TableCell className="text-right">{score.score}</TableCell>
                  <TableCell className="text-right">
                    {formatDate(score.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
