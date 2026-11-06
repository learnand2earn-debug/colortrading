"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useGame } from "@/context/GameContext";
import { Camera, Upload, X, Check, Sparkles, Image as ImageIcon } from "lucide-react";

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  { id: "king", label: "Gold King", emoji: "👑", gradient: "from-amber-400 to-yellow-500" },
  { id: "tiger", label: "Lucky Tiger", emoji: "🐯", gradient: "from-orange-500 to-red-500" },
  { id: "phoenix", label: "Fire Phoenix", emoji: "🦅", gradient: "from-rose-500 to-amber-500" },
  { id: "dragon", label: "Green Dragon", emoji: "🐉", gradient: "from-emerald-500 to-teal-600" },
  { id: "diamond", label: "Diamond Ace", emoji: "💎", gradient: "from-blue-500 to-indigo-600" },
  { id: "clover", label: "Lucky Clover", emoji: "🍀", gradient: "from-green-500 to-emerald-600" },
  { id: "ninja", label: "Neon Warrior", emoji: "🥷", gradient: "from-purple-600 to-indigo-700" },
  { id: "crown92", label: "92 VIP Ace", emoji: "⭐", gradient: "from-amber-500 via-rose-500 to-purple-600" },
];

export const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateAvatar } = useGame();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string>(user.avatar_url || "");
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"upload" | "presets">("upload");
  const [successMessage, setSuccessMessage] = useState<string>("");

  if (!isOpen) return null;

  // Handle local file selection from phone gallery or camera
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreviewUrl(dataUrl);
      setSelectedPreset("");
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: typeof PRESET_AVATARS[0]) => {
    // Generate SVG data url for the preset avatar
    const svgDataUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" rx="30" fill="%230f172a"/><text x="50" y="62" font-size="50" text-anchor="middle">${preset.emoji}</text></svg>`;
    setPreviewUrl(svgDataUrl);
    setSelectedPreset(preset.id);
  };

  const handleSave = () => {
    if (!previewUrl) return;
    updateAvatar(previewUrl);
    setSuccessMessage("Profile photo updated successfully!");
    setTimeout(() => {
      setSuccessMessage("");
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="text-base font-black text-slate-900">
              Customize Profile Photo
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Avatar Preview */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-4 border-amber-400 shadow-card-float bg-slate-100 flex items-center justify-center">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl sm:text-4xl font-black text-game-green">
                {user.username.slice(0, 2).toUpperCase()}
              </span>
            )}
            <div className="absolute bottom-1 right-1 bg-amber-500 text-white p-1 rounded-lg shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-xs font-bold text-slate-600 mt-2">
            {user.username}
          </span>
        </div>

        {/* Sub-tabs: Upload Photo vs Choose Presets */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "upload"
                ? "bg-game-green text-white shadow-sm font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("presets")}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "presets"
                ? "bg-game-green text-white shadow-sm font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIP Presets</span>
          </button>
        </div>

        {/* Tab 1: Upload from Device */}
        {activeTab === "upload" && (
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-game-green rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-emerald-50/30 space-y-2"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-game-green flex items-center justify-center mx-auto shadow-sm">
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Click to browse photo from Camera / Gallery
              </p>
              <p className="text-[11px] text-slate-400">
                Supports JPG, PNG, WEBP (Max 5MB)
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: VIP Avatars Gallery */}
        {activeTab === "presets" && (
          <div className="grid grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
            {PRESET_AVATARS.map((p) => {
              const isSelected = selectedPreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all ${
                    isSelected
                      ? "bg-amber-50 border-amber-400 shadow-sm scale-105"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-2xl mb-1">{p.emoji}</span>
                  <span className="text-[10px] font-bold text-slate-700 truncate w-full text-center">
                    {p.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Success Notice */}
        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-game-green text-xs font-bold flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Save Button */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!previewUrl}
            className="w-2/3 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-game-green to-emerald-600 text-white font-black text-xs shadow-neon-green hover:brightness-105 active:scale-95 transition-all disabled:opacity-40"
          >
            Save Profile Photo
          </button>
        </div>
      </div>
    </div>
  );
};

