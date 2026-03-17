"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  referralCode: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", avatarUrl: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/dashboard/stats", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
        setForm({
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          avatarUrl: data.user.avatarUrl || "",
        });
      }
    }
    fetchProfile();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const res = await fetch("/api/dashboard/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: form.email,
        first_name: form.firstName,
        last_name: form.lastName,
        avatar_url: form.avatarUrl,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setProfile(data.user);
      setEdit(false);
    } else {
      alert("Failed to update profile");
    }
  };

  const handlePasswordSave = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    const res = await fetch("/api/dashboard/profile/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }),
    });
    if (res.ok) {
      setPasswordSuccess("Password changed successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      const data = await res.json();
      setPasswordError(data.error || "Failed to change password");
    }
  };

  if (!profile) {
    return <div className="glass-card p-6 max-w-xl mx-auto mt-8 text-tertiary">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-8">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-bold text-primary mb-4">Profile</h1>
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-20 h-20 border-2 border-white/20">
            <AvatarImage src={profile.avatarUrl || "/placeholder-user.jpg"} />
            <AvatarFallback className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-semibold text-2xl">
              {profile.firstName?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-primary font-semibold text-lg">
              {profile.firstName} {profile.lastName}
            </div>
            <div className="text-tertiary text-sm">{profile.email}</div>
            <div className="text-blue-400 text-xs mt-1">Referral Code: <span className="font-mono bg-white/10 px-2 py-1 rounded">{profile.referralCode}</span></div>
          </div>
        </div>
        <button
          className="btn-gradient px-4 py-2 rounded-lg font-semibold mb-4"
          onClick={() => setEdit((v) => !v)}
        >
          {edit ? "Cancel" : "Edit Profile"}
        </button>
        {edit && (
          <form className="space-y-4">
            <div>
              <label className="block text-tertiary text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleProfileChange}
                className="glass-input w-full"
              />
            </div>
            <div>
              <label className="block text-tertiary text-sm mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleProfileChange}
                className="glass-input w-full"
              />
            </div>
            <div>
              <label className="block text-tertiary text-sm mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleProfileChange}
                className="glass-input w-full"
              />
            </div>
            <div>
              <label className="block text-tertiary text-sm mb-1">Avatar URL</label>
              <input
                type="text"
                name="avatarUrl"
                value={form.avatarUrl}
                onChange={handleProfileChange}
                className="glass-input w-full"
              />
            </div>
            <button type="button" className="btn-gradient px-4 py-2 rounded-lg font-semibold" onClick={handleSave}>Save</button>
          </form>
        )}
        {/* Password Change Section */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-primary mb-2">Change Password</h2>
          <form className="space-y-4 max-w-md">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="glass-input w-full"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="glass-input w-full"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="glass-input w-full"
              />
            </div>
            {passwordError && <div className="text-red-400 text-sm">{passwordError}</div>}
            {passwordSuccess && <div className="text-green-400 text-sm">{passwordSuccess}</div>}
            <button type="button" className="btn-gradient px-4 py-2 rounded-lg font-semibold" onClick={handlePasswordSave}>Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
} 