"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const leaderboardData = [
  {
    rank: 1,
    player: "WordMaster",
    score: 10000,
    gamesPlayed: 100,
    winRate: "95%",
    averageGuesses: 3.2,
  },
  {
    rank: 2,
    player: "LexiconLegend",
    score: 9500,
    gamesPlayed: 95,
    winRate: "92%",
    averageGuesses: 3.5,
  },
  {
    rank: 3,
    player: "VocabVirtuoso",
    score: 9000,
    gamesPlayed: 90,
    winRate: "90%",
    averageGuesses: 3.7,
  },
  {
    rank: 4,
    player: "SpellingSpecialist",
    score: 8500,
    gamesPlayed: 85,
    winRate: "88%",
    averageGuesses: 3.9,
  },
  {
    rank: 5,
    player: "GrammarGuru",
    score: 8000,
    gamesPlayed: 80,
    winRate: "85%",
    averageGuesses: 4.1,
  },
  {
    rank: 6,
    player: "WordWizard",
    score: 7500,
    gamesPlayed: 75,
    winRate: "83%",
    averageGuesses: 4.2,
  },
  {
    rank: 7,
    player: "LetterLord",
    score: 7000,
    gamesPlayed: 70,
    winRate: "80%",
    averageGuesses: 4.3,
  },
  {
    rank: 8,
    player: "SyntaxSage",
    score: 6500,
    gamesPlayed: 65,
    winRate: "78%",
    averageGuesses: 4.4,
  },
  {
    rank: 9,
    player: "PuzzlePro",
    score: 6000,
    gamesPlayed: 60,
    winRate: "75%",
    averageGuesses: 4.5,
  },
  {
    rank: 10,
    player: "WordSmith",
    score: 5500,
    gamesPlayed: 55,
    winRate: "73%",
    averageGuesses: 4.6,
  },
];

export default function Leaderboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = leaderboardData.filter((player) =>
    player.player.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8 text-white">
        <h1 className="text-3xl font-bold mb-6 text-white">Leaderboard</h1>
        <Card className="bg-black border border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Top Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-900 text-white border-gray-700 placeholder-gray-400"
              />
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="w-[80px] text-gray-400">
                      Rank
                    </TableHead>
                    <TableHead className="text-gray-400">Player</TableHead>
                    <TableHead className="text-right text-gray-400">
                      Score
                    </TableHead>
                    <TableHead className="text-right text-gray-400">
                      Games Played
                    </TableHead>
                    <TableHead className="text-right text-gray-400">
                      Win Rate
                    </TableHead>
                    <TableHead className="text-right text-gray-400">
                      Avg. Guesses
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((player) => (
                    <TableRow key={player.rank} className="border-gray-800">
                      <TableCell className="font-medium text-white">
                        {player.rank}
                      </TableCell>
                      <TableCell className="text-white">
                        {player.player}
                      </TableCell>
                      <TableCell className="text-right text-white">
                        {player.score.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-white">
                        {player.gamesPlayed}
                      </TableCell>
                      <TableCell className="text-right text-white">
                        {player.winRate}
                      </TableCell>
                      <TableCell className="text-right text-white">
                        {player.averageGuesses}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
