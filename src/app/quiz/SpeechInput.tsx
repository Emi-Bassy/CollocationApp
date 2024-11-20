"use client";

import { useState } from "react";

interface SpeechInputProps {
  onResult: (text: string) => void; // 音声入力結果を親に渡すためのコールバック
}

const SpeechInput = ({ onResult }: SpeechInputProps) => {
  const [isActive, setIsActive] = useState(false);

  const handleOnRecord = () => {
    if (isActive) {
      // 録音終了
      setIsActive(false);
      console.log("Recording stopped");
      return;
    }

    console.log("Recording started");
    setIsActive(true);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Recognized text:", transcript);
      onResult(transcript); // 認識結果を親コンポーネントに渡す
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      setIsActive(false); // 終了時にボタンの状態をリセット
    };

    recognition.start();
  };

  return (
    <button
      onClick={handleOnRecord}
      className={`w-full uppercase font-semibold text-sm ${
        isActive ? "text-white bg-red-500" : "text-zinc-400 bg-zinc-900"
      } py-3 rounded-sm`}
    >
      {isActive ? "終了" : "音声入力開始"}
    </button>
  );
};

export default SpeechInput;
