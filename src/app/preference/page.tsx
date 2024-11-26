"use client";

import { useEffect, useState } from "react";

const PreferencePage = () => {
  const [pitch, setPitch] = useState(1); // ピッチ
  const [rate, setRate] = useState(1); // 速さ
  const [volume, setVolume] = useState(1); // 音量

  // 音声リストの取得
  useEffect(() => {
    const savedPreferences = JSON.parse(localStorage.getItem("speechPreferences") || "{}");
    if (savedPreferences.pitch) setPitch(savedPreferences.pitch);
    if (savedPreferences.rate) setRate(savedPreferences.rate);
    if (savedPreferences.volume) setVolume(savedPreferences.volume);
  }, []);

  const handleSavePreferences = () => {
    // 設定をlocalStorageに保存
    localStorage.setItem(
      "speechPreferences",
      JSON.stringify({ pitch, rate, volume })
    );
    alert("Preferences saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl text-black font-bold text-center mb-4">Preferences</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Pitch</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-gray-500">Current: {pitch}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rate</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-gray-500">Current: {rate}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-gray-500">Current: {volume}</p>
          </div>
          <button
            onClick={handleSavePreferences}
            className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencePage;
