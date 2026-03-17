"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";

interface RankingEntry {
  rank: number;
  name: string;
  email: string;
  referralCount: number;
  referralEarnings: number;
}

export default function RankingPage() {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRanking() {
      const res = await fetch("/api/dashboard/ranking", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setRanking(data);
      }
      setLoading(false);
    }
    fetchRanking();
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="glass-card p-6 mb-6">
        <h1 className="text-2xl font-bold text-white mb-4 flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-400" /> Referral Leaderboard
        </h1>
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : ranking.length === 0 ? (
          <div className="text-gray-400">No ranking data available.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2 text-gray-300">Rank</th>
                  <th className="text-left p-2 text-gray-300">User</th>
                  <th className="text-left p-2 text-gray-300">Email</th>
                  <th className="text-left p-2 text-gray-300">Referrals</th>
                  <th className="text-left p-2 text-gray-300">Earnings</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((entry) => (
                  <tr key={entry.rank}>
                    <td className="p-2 text-yellow-400 font-bold">{entry.rank}</td>
                    <td className="p-2 text-white">{entry.name}</td>
                    <td className="p-2 text-gray-300">{entry.email}</td>
                    <td className="p-2 text-blue-400">{entry.referralCount}</td>
                    <td className="p-2 text-green-400">${entry.referralEarnings.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 