"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Layers, Lock, TrendingUp, DollarSign } from "lucide-react";

interface StakingPool {
  id: number;
  name: string;
  description?: string;
  apy: number;
  minStake: number;
  maxStake: number;
  lockPeriod: number;
  totalStaked: number;
  uniqueUsers: number;
  status: string;
  features?: string[];
  userStake?: {
    amount: number;
    status: string;
  } | null;
}

interface UserStake {
  id: string;
  poolName: string;
  poolDescription?: string;
  amount: number;
  apy: number;
  lockPeriod: number;
  startDate: string;
  endDate?: string;
  status: string;
  rewardsEarned: number;
  progress: number;
  canUnstake: boolean;
  canClaimRewards: boolean;
  nextRewardDate?: string;
}

export default function StakingPage() {
  const router = useRouter();
  const [stakingPools, setStakingPools] = useState<StakingPool[]>([]);
  const [myStakes, setMyStakes] = useState<UserStake[]>([]);
  const [selectedPool, setSelectedPool] = useState<number | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stakeLoading, setStakeLoading] = useState(false);
  const [unstakeLoading, setUnstakeLoading] = useState<string | null>(null);
  const [claimLoading, setClaimLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchStakingData();
  }, []);

  const fetchStakingData = async () => {
    setLoading(true);
    try {
      const [poolsRes, stakesRes] = await Promise.all([
        fetch("/api/staking/pools", { credentials: "include" }),
        fetch("/api/staking/user-stakes", { credentials: "include" }),
      ]);
      if (poolsRes.ok) {
        setStakingPools(await poolsRes.json());
      } else {
        throw new Error("Failed to fetch pools");
      }
      if (stakesRes.ok) {
        setMyStakes(await stakesRes.json());
      } else {
        throw new Error("Failed to fetch stakes");
      }
    } catch (e) {
      setError("Failed to load staking data.");
    } finally {
      setLoading(false);
    }
  };

  const handleStakeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStakeAmount(value);
    const pool = stakingPools.find((p) => p.id === selectedPool);
    if (pool) {
      const amount = parseFloat(value);
      if (isNaN(amount) || amount < pool.minStake || amount > pool.maxStake) {
        setError(`Amount must be between $${pool.minStake} and $${pool.maxStake}`);
      } else {
        setError(null);
      }
    }
  };

  const handleStake = async () => {
    setError(null);
    setSuccess(null);
    setStakeLoading(true);
    try {
      const pool = stakingPools.find((p) => p.id === selectedPool);
      if (!pool) {
        setError("Invalid pool selected.");
        setStakeLoading(false);
        return;
      }
      const amount = parseFloat(stakeAmount);
      if (isNaN(amount) || amount < pool.minStake || amount > pool.maxStake) {
        setError(`Amount must be between $${pool.minStake} and $${pool.maxStake}`);
        setStakeLoading(false);
        return;
      }
      const res = await fetch("/api/staking/user-stakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ poolId: pool.id, amount }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to stake.");
      } else {
        setSuccess("Stake successful!");
        setStakeAmount("");
        setSelectedPool(null);
        fetchStakingData();
      }
    } catch (e) {
      setError("Failed to stake.");
    } finally {
      setStakeLoading(false);
    }
  };

  const handleUnstake = async (stakeId: string) => {
    setError(null);
    setSuccess(null);
    setUnstakeLoading(stakeId);
    try {
      const res = await fetch(`/api/staking/user-stakes/${stakeId}/unstake`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to unstake.");
      } else {
        setSuccess("Unstake successful!");
        fetchStakingData();
      }
    } catch (e) {
      setError("Failed to unstake.");
    } finally {
      setUnstakeLoading(null);
    }
  };

  const handleClaimRewards = async (stakeId: string) => {
    setError(null);
    setSuccess(null);
    setClaimLoading(stakeId);
    try {
      const res = await fetch(`/api/staking/user-stakes/${stakeId}/claim-rewards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to claim rewards.");
      } else {
        setSuccess("Rewards claimed successfully!");
        fetchStakingData();
      }
    } catch (e) {
      setError("Failed to claim rewards.");
    } finally {
      setClaimLoading(null);
    }
  };

  const totalStaked = useMemo(() => myStakes.reduce((sum, stake) => sum + stake.amount, 0), [myStakes]);
  const totalEarned = useMemo(() => myStakes.reduce((sum, stake) => sum + stake.rewardsEarned, 0), [myStakes]);
  const avgApy = useMemo(
    () => (stakingPools.length ? (stakingPools.reduce((sum, p) => sum + p.apy, 0) / stakingPools.length).toFixed(2) : "0.00"),
    [stakingPools]
  );

  if (loading) {
    return <div className="text-center text-white p-8">Loading staking data...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-2">Staking</h1>
        <p className="text-tertiary text-sm sm:text-base">Stake your assets and earn passive income</p>
      </div>
      {error && <div className="bg-red-500/80 text-white rounded p-2 mb-2">{error}</div>}
      {success && <div className="bg-green-500/80 text-white rounded p-2 mb-2">{success}</div>}
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="glass-card">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tertiary text-xs sm:text-sm">Total Staked</p>
                <p className="text-lg sm:text-2xl font-bold text-primary">${totalStaked.toLocaleString()}</p>
              </div>
              <div className="text-purple-400">
                <Layers className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tertiary text-xs sm:text-sm">Total Earned</p>
                <p className="text-lg sm:text-2xl font-bold text-primary">${totalEarned.toLocaleString()}</p>
              </div>
              <div className="text-green-400">
                <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tertiary text-xs sm:text-sm">Active Stakes</p>
                <p className="text-lg sm:text-2xl font-bold text-primary">{myStakes.length}</p>
              </div>
              <div className="text-blue-400">
                <Lock className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tertiary text-xs sm:text-sm">Avg. APY</p>
                <p className="text-lg sm:text-2xl font-bold text-primary">{avgApy}%</p>
              </div>
              <div className="text-yellow-400">
                <DollarSign className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Staking Pools */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">Available Pools</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
          {stakingPools.map((pool) => (
            <Card key={pool.id} className="glass-card hover:bg-white/10 transition-all duration-300">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-primary text-base sm:text-lg lg:text-xl">{pool.name}</CardTitle>
                    <p className="text-tertiary text-xs sm:text-sm mt-1">APY: {pool.apy}%</p>
                  </div>
                  <Badge variant={pool.status === "active" ? "default" : "secondary"} className="text-xs">
                    {pool.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-tertiary text-xs sm:text-sm">Min Stake</p>
                      <p className="text-primary font-semibold text-sm sm:text-base">${pool.minStake.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-tertiary text-xs sm:text-sm">Max Stake</p>
                      <p className="text-primary font-semibold text-sm sm:text-base">${pool.maxStake.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-tertiary text-xs sm:text-sm">Total Staked</p>
                      <p className="text-primary font-semibold text-sm sm:text-base">${pool.totalStaked.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-tertiary text-xs sm:text-sm">Participants</p>
                      <p className="text-primary font-semibold text-sm sm:text-base">{pool.uniqueUsers.toLocaleString()}</p>
                    </div>
                  </div>
                  {pool.lockPeriod > 0 && (
                    <div className="text-center">
                      <p className="text-tertiary text-xs sm:text-sm">Lock Period</p>
                      <p className="text-accent font-semibold text-sm sm:text-base">{pool.lockPeriod} days</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setSelectedPool(pool.id)}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
                      disabled={pool.status !== "active"}
                    >
                      Stake Now
                    </Button>
                    <Button
                      onClick={() => router.push(`/dashboard/staking/${pool.id}`)}
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {/* My Stakes */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">My Stakes</h2>
        </div>
        {myStakes.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <div className="text-gray-400 mb-4">
                <Layers className="w-12 h-12 mx-auto mb-2" />
              </div>
              <h3 className="text-primary font-semibold text-lg mb-2">No Active Stakes</h3>
              <p className="text-tertiary text-sm mb-4">Start staking to earn passive income</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {myStakes.map((stake) => (
              <Card key={stake.id} className="glass-card">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-primary font-semibold text-sm sm:text-base">{stake.poolName}</h3>
                        <Badge variant={stake.status === "active" ? "default" : "secondary"} className="text-xs">
                          {stake.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                        <div>
                          <p className="text-tertiary">Amount</p>
                          <p className="text-primary font-semibold">${stake.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-tertiary">APY</p>
                          <p className="text-accent font-semibold">{stake.apy}%</p>
                        </div>
                        <div>
                          <p className="text-tertiary">Earned</p>
                          <p className="text-accent font-semibold">${stake.rewardsEarned.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-tertiary">Progress</p>
                          <p className="text-primary font-semibold">{stake.progress}%</p>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-4">
                        <Progress value={stake.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>Start: {new Date(stake.startDate).toLocaleDateString()}</span>
                          <span>End: {stake.endDate ? new Date(stake.endDate).toLocaleDateString() : "Flexible"}</span>
                        </div>
                        {stake.nextRewardDate && (
                          <div className="text-xs text-blue-400 mt-1">
                            Next reward: {new Date(stake.nextRewardDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-3 sm:mt-4">
                        {stake.canClaimRewards && (
                          <Button
                            onClick={() => handleClaimRewards(stake.id)}
                            disabled={claimLoading === stake.id}
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600"
                          >
                            {claimLoading === stake.id ? "Claiming..." : "Claim Rewards"}
                          </Button>
                        )}
                        {stake.canUnstake && (
                          <Button
                            onClick={() => handleUnstake(stake.id)}
                            disabled={unstakeLoading === stake.id}
                            size="sm"
                            variant="outline"
                            className="flex-1 border-red-500 text-red-400 hover:bg-red-500/20"
                          >
                            {unstakeLoading === stake.id ? "Unstaking..." : "Unstake"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* Stake Dialog */}
      {selectedPool && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setSelectedPool(null);
            setStakeAmount("");
            setError(null);
            setSuccess(null);
          }}
        >
          <Card 
            className="glass-card max-w-md sm:max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className="text-primary text-lg sm:text-xl">
                Stake in {stakingPools.find((p) => p.id === selectedPool)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const pool = stakingPools.find((p) => p.id === selectedPool);
                return pool ? (
                  <div className="bg-white/5 rounded-lg p-3 mb-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-tertiary">APY:</span>
                        <span className="text-accent font-semibold ml-1">{pool.apy}%</span>
                      </div>
                      <div>
                        <span className="text-tertiary">Min Stake:</span>
                        <span className="text-primary font-semibold ml-1">${pool.minStake.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-tertiary">Max Stake:</span>
                        <span className="text-primary font-semibold ml-1">${pool.maxStake.toLocaleString()}</span>
                      </div>
                      {pool.lockPeriod > 0 && (
                        <div>
                          <span className="text-tertiary">Lock Period:</span>
                          <span className="text-accent font-semibold ml-1">{pool.lockPeriod} days</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null;
              })()}
              <div>
                <Label htmlFor="amount" className="text-primary text-sm">
                  Stake Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={stakeAmount}
                  onChange={handleStakeAmountChange}
                  className="bg-white/10 border-white/20 text-primary placeholder-tertiary mt-1"
                  min="0"
                  step="0.01"
                  aria-describedby={error ? "amount-error" : undefined}
                />
                {error && (
                  <p id="amount-error" className="text-red-500 text-xs mt-1">
                    {error}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setSelectedPool(null);
                    setStakeAmount("");
                    setError(null);
                    setSuccess(null);
                  }}
                  variant="outline"
                  className="flex-1"
                  disabled={stakeLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStake}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
                  disabled={stakeLoading || !!error}
                >
                  {stakeLoading ? "Staking..." : "Confirm Stake"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}