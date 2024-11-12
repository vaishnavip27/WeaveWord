"use client";

import { useEffect, useState } from "react";
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
import { fetchAllScores } from "@/utils/ao";

type ScoreEntry = {
  player: string;
  score: number;
  timestamp: number;
};

export default function Component() {
  const [searchTerm, setSearchTerm] = useState("");
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAllScores();
        // Sort scores in descending order
        const sortedScores = response.sort(
          (a: ScoreEntry, b: ScoreEntry) => b.score - a.score
        );
        setScores(sortedScores);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredData = scores.filter((entry) =>
    entry.player.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#0E0E11] my-14">
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
                    <TableHead className="text-gray-400">Player ID</TableHead>
                    <TableHead className="text-right text-gray-400">
                      Score
                    </TableHead>
                    <TableHead className="text-right text-gray-400">
                      Timestamp
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((entry, index) => (
                    <TableRow
                      key={`${entry.player}-${entry.timestamp}`}
                      className="border-gray-800"
                    >
                      <TableCell className="font-medium text-white">
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-white">
                        {entry.player}
                      </TableCell>
                      <TableCell className="text-right text-white">
                        {entry.score.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-white">
                        {new Date(entry.timestamp).toLocaleString()}
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
