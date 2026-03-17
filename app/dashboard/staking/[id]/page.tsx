"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Lock, DollarSign, Calendar, BarChart3, ArrowLeft } from "lucide-react";

export default function StakingPoolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [pool, setPool] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakeLoading, setStakeLoading] = useState(false);
  const [stakeError, setStakeError] = useState("");
  const [stakeSuccess, setStakeSuccess] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch("/api/staking/pools", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: any) => String(p.id) === String(id));
        if (!found) {
          setError("Staking pool not found.");
        } else {
          setPool(found);
        }
      })
      .catch(() => setError("Failed to load pool."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStake = async () => {
    setStakeError("");
    setStakeSuccess("");
    setStakeLoading(true);
    try {
      const amount = parseFloat(stakeAmount);
      if (isNaN(amount) || amount < pool.minStake || amount > pool.maxStake) {
        setStakeError(`Amount must be between $${pool.minStake} and $${pool.maxStake}`);
        setStakeLoading(false);
        return;
      }
      const res = await fetch("/api/staking/user-stakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ poolId: pool.id, amount })
      });
      const data = await res.json();
      if (!res.ok) {
        setStakeError(data.error || "Failed to stake.");
      } else {
        setStakeSuccess("Stake successful!");
        setStakeAmount("");
      }
    } catch (e) {
      setStakeError("Failed to stake.");
    } finally {
      setStakeLoading(false);
    }
  };

  if (loading) return <div className="text-center text-white p-8">Loading pool...</div>;
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;
  if (!pool) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          onClick={() => router.back()} 
          variant="outline" 
          size="sm"
          className="text-white border-white/20 hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Staking
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{pool.name}</h1>
          <p className="text-gray-300 text-sm sm:text-base">{pool.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Pool Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pool Stats */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Pool Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-green-400 mb-1">
                    <TrendingUp className="w-6 h-6 mx-auto" />
                  </div>
                  <p className="text-gray-400 text-xs">APY</p>
                  <p className="text-green-400 font-bold text-lg">{pool.apy}%</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-blue-400 mb-1">
                    <DollarSign className="w-6 h-6 mx-auto" />
                  </div>
                  <p className="text-gray-400 text-xs">Total Staked</p>
                  <p className="text-white font-bold text-lg">${pool.totalStaked.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-purple-400 mb-1">
                    <Users className="w-6 h-6 mx-auto" />
                  </div>
                  <p className="text-gray-400 text-xs">Participants</p>
                  <p className="text-white font-bold text-lg">{pool.uniqueUsers.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-orange-400 mb-1">
                    <Lock className="w-6 h-6 mx-auto" />
                  </div>
                  <p className="text-gray-400 text-xs">Lock Period</p>
                  <p className="text-white font-bold text-lg">{pool.lockPeriod} days</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-yellow-400 mb-1">
                    <DollarSign className="w-6 h-6 mx-auto" />
                  </div>
                  <p className="text-gray-400 text-xs">Min Stake</p>
                  <p className="text-white font-bold text-lg">${pool.minStake.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-red-400 mb-1">
                    <DollarSign className="w-6 h-6 mx-auto" />
                  </div>
                  <p className="text-gray-400 text-xs">Max Stake</p>
                  <p className="text-white font-bold text-lg">${pool.maxStake.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pool Capacity */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white text-xl">Pool Capacity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Pool Utilization</span>
                    <span className="text-white">
                      {((pool.totalStaked / pool.maxStake) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={(pool.totalStaked / pool.maxStake) * 100} 
                    className="h-3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Available for Staking:</span>
                    <span className="text-green-400 font-semibold ml-2">
                      ${(pool.maxStake - pool.totalStaked).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Max Pool Size:</span>
                    <span className="text-white font-semibold ml-2">
                      ${pool.maxStake.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staking Interface */}
        <div className="lg:col-span-1">
          <Card className="glass-card sticky top-4">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Stake in Pool
              </CardTitle>
              <div className="mt-2">
                <Badge 
                  variant={pool.status === 'active' ? 'default' : 'secondary'} 
                  className="text-xs"
                >
                  {pool.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {pool.status === 'active' ? (
                <>
                  {stakeError && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg p-3 text-sm">
                      {stakeError}
                    </div>
                  )}
                  {stakeSuccess && (
                    <div className="bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg p-3 text-sm">
                      {stakeSuccess}
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Stake Amount</label>
                      <Input
                        type="number"
                        placeholder={`$${pool.minStake.toLocaleString()} - $${pool.maxStake.toLocaleString()}`}
                        value={stakeAmount}
                        onChange={e => setStakeAmount(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        min={pool.minStake}
                        max={pool.maxStake}
                        step="0.01"
                      />
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-3 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">APY:</span>
                        <span className="text-green-400 font-semibold">{pool.apy}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Lock Period:</span>
                        <span className="text-white font-semibold">{pool.lockPeriod} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Min Stake:</span>
                        <span className="text-white font-semibold">${pool.minStake.toLocaleString()}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleStake} 
                      disabled={stakeLoading || !stakeAmount} 
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
                    >
                      {stakeLoading ? "Staking..." : "Stake Now"}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Lock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-400 text-sm">This pool is currently {pool.status}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 