"use client";

import { useEffect, useState } from "react";
import { Users, Copy, CheckCircle } from "lucide-react";

interface ReferralStats {
  referralLink: string;
  referralCount: number;
  referralEarnings: number;
  referredUsers: Array<{
    name: string;
    email: string;
    joinedAt: string;
    reward: number;
  }>;
}

export default function ReferralsPage() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      // Fetch dashboard stats
      const statsRes = await fetch("/api/dashboard/stats", { credentials: "include" });
      const statsData = await statsRes.json();
      // Fetch referred users (optional, fallback to empty array)
      let referredUsers: ReferralStats["referredUsers"] = [];
      try {
        const usersRes = await fetch("/api/dashboard/referrals", { credentials: "include" });
        if (usersRes.ok) {
          referredUsers = await usersRes.json();
        }
      } catch {}
      setStats({
        referralLink: `${window.location.origin}/signup?ref=${statsData.user.referralCode}`,
        referralCount: statsData.referralCount || 0,
        referralEarnings: statsData.referralEarnings || 0,
        referredUsers,
      });
    }
    fetchStats();
  }, []);

  const handleCopy = () => {
    if (stats) {
      navigator.clipboard.writeText(stats.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="glass-card p-6 mb-6">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
          <Users className="w-6 h-6 mr-2 text-blue-400" /> Referrals
        </h1>
        {stats ? (
          <>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/10 text-white px-3 py-2 rounded-lg text-sm select-all">
                  {stats.referralLink}
                </span>
                <button
                  className="btn-gradient px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1"
                  onClick={handleCopy}
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <div className="text-white text-sm">
                  <span className="font-semibold">Successful Referrals:</span> {stats.referralCount}
                </div>
                <div className="text-blue-400 text-sm">
                  <span className="font-semibold">Total Referral Earnings:</span> ${stats.referralEarnings.toLocaleString()}
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Referred Users</h2>
              {stats.referredUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left p-2 text-gray-300">Name</th>
                        <th className="text-left p-2 text-gray-300">Joined</th>
                        <th className="text-left p-2 text-gray-300">Reward</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.referredUsers.map((user, idx) => (
                        <tr key={idx}>
                          <td className="p-2 text-white">{user.name}</td>
                          <td className="p-2 text-gray-300">{new Date(user.joinedAt).toLocaleDateString()}</td>
                          <td className="p-2 text-green-400">${user.reward.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-gray-400">No referrals yet.</div>
              )}
            </div>
          </>
        ) : (
          <div className="text-gray-400">Loading...</div>
        )}
      </div>
    </div>
  );
} 