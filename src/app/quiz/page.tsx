"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

const QuizPage = () => {
  const searchParams = useSearchParams();
  const question = searchParams.get("question"); // クイズ文（日本語）
  const answer = searchParams.get("answer"); // 正解（コロケーション）

  const [isRecording, setIsRecording] = useState(false); // 録音状態
  const [spokenText, setSpokenText] = useState<string>(""); // 音声認識結果
  const [translation, setTranslation] = useState<string>(""); // 翻訳結果

  const handleOnRecord = () => {
    if (isRecording) {
      setIsRecording(false); // 録音を停止
      console.log("Recording stopped");
      return;
    }

    console.log("Recording started");
    setIsRecording(true);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; // 音声入力の言語設定

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript; // 認識されたテキスト
      console.log("Recognized text:", transcript);
      setSpokenText(transcript);

      // 翻訳APIにリクエストを送信
      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: transcript, language: "ja-JP" }),
        });
        const data = await response.json();
        setTranslation(data.text); // 翻訳結果を保存
      } catch (error) {
        console.error("Translation failed:", error);
      }
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      setIsRecording(false);
    };

    recognition.start();
  };

  if (!question || !answer) {
    return <p>Loading...</p>; // クイズデータがロード中の場合
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Quiz</h1>
  
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* ローディング状態を考慮した条件付きレンダリング */}
          {!question || !answer ? (
            <div className="text-center py-6">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="text-lg font-medium text-gray-700">Question:</p>
                <p className="mt-1 text-gray-600">{question}</p>
              </div>
  
              <div className="border-b pb-4">
                <p className="text-lg font-medium text-gray-700">Practice Collocation:</p>
                <p className="mt-1 text-gray-600">{answer}</p>
              </div>
  
              <div className="flex justify-center py-4">
                <button
                  onClick={handleOnRecord}
                  className={`px-6 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-zinc-900 hover:bg-zinc-800 text-zinc-100"
                  }`}
                >
                  {isRecording ? "Stop" : "Start Recording"}
                </button>
              </div>
  
              <div className="pt-4 space-y-3">
                <div>
                  <p className="text-lg font-medium text-gray-700">Spoken Text:</p>
                  <p className="mt-1 text-gray-600">{spokenText || "No input detected yet."}</p>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700">Translation:</p>
                  <p className="mt-1 text-gray-600">{translation || "Translation will appear here."}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  

//   return (
//     <div className="quiz-container">
//       <h1 className="text-3xl font-bold text-center mb-8">Quiz</h1>
//       <p className="mb-4">Question: {question}</p> {/* 日本語のクイズ文 */}
//       <p className="mb-6">Practice Collocation: {answer}</p> {/* コロケーション */}

//       <div className="mt-6">
//         <button
//           onClick={handleOnRecord}
//           className={`w-full uppercase font-semibold text-sm ${
//             isRecording ? "text-white bg-red-500" : "text-zinc-400 bg-zinc-900"
//           } py-3 rounded-sm`}
//         >
//           {isRecording ? "Stop" : "Start Recording"}
//         </button>
//       </div>

//       <div className="mt-6">
//         <p className="mb-2">Spoken Text: {spokenText}</p> {/* 音声認識結果 */}
//         <p>Translation: {translation}</p> {/* 翻訳結果 */}
//       </div>
//     </div>
//   );
};



export default QuizPage;




// "use client"

// import { useState } from "react";

// const Translator = () => {
//     const isActive = false;
//     const isSpeechDetected = false;
//     const language = 'ja-JP';
//     const [text, setText] = useState<string>();    // 認識されたテキストを保存
//     const [tranlation, setTranslation] = useState<string>();    // 翻訳されたテキストを保存

//     // 録音を処理する関数
//     function handleOnRecord() {
//         console.log("Recording started");

//         // クロスブラウザ対応のため、SpeechRecognition オブジェクトを取得
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

//         // Speech Recognition API のインスタンスを生成
//         const recognition = new SpeechRecognition();

//         recognition.lang = 'en-US'

//         recognition.onresult = async function (event) {
//             // ログとして書き出し中身を確認
//             console.log("event", event);

//             // 認識されたテキストを取得
//             const transcript = event.results[0][0].transcript;

//             // 認識されたテキストを保存
//             setText(transcript);

//             // 翻訳をリクエスト
//             const results = await fetch("api/translate", {
//                 method: "POST",
//                 body: JSON.stringify({
//                     text: transcript,
//                     language: language,
//                 }),
//             }).then((r) => r.json());

//             // 翻訳されたテキストを保存
//             setTranslation(results.text);
//         };

//         // 録音を開始
//         recognition.start();
//     }

//     return (
//         <div className="mt-12 px-4">
//             <div className="max-w-lg rounded-xl overflow-hidden mx-auto">
//                 <div className="bg-zinc-200 p-4 border-b-4 border-zinc-300">
//                     <div className="bg-blue-200 rounded-lg p-2 border-2 border-blue-300">
//                         <ul className="font-mono font-bold text-blue-900 uppercase px-4 py-2 border border-blue-800 rounded">
//                             <li>
//                                 &gt; Translation Mode: 
//                             </li>
//                             <li>
//                                 &gt; Dialect:
//                             </li>
//                         </ul>
//                     </div>
//                 </div>

//                 <div className="bg-zinc-800 p-4 border-b-4 border-zinc-950">
//                     <p className="flex items-center gap-3">
//                         <span className={`block rounded-full w-5 h-5 flex-shrink-0 flex-grow-0 ${isActive ? 'bg-red-500' : 'bg-red-900'} `}>
//                             <span className="sr-only">{ isActive ? 'Actively recording' : 'Not actively recording' }</span>
//                         </span>
//                         <span className={`block rounded w-full h-5 flex-grow-1 ${isSpeechDetected ? 'bg-green-500' : 'bg-green-900'}`}>
//                             <span className="sr-only">{ isSpeechDetected ? 'Speech is being recorded' : 'Speech is not being recorded' }</span>
//                         </span>
//                     </p>
//                 </div>

//                 <div className="bg-zinc-800 p-4">
//                     <div className="grid sm:grid-cols-2 gap-4 max-w-lg bg-zinc-200 rounded-lg p-5 mx-auto">
//                         <p>
//                             <button
//                                 className={`w-full h-full uppercase font-semibold text-sm  ${isActive ? 'text-white bg-red-500' : 'text-zinc-400 bg-zinc-900'} color-white py-3 rounded-sm`}
//                                 onClick={handleOnRecord}
//                                 >
//                                 { isActive ? 'Stop' : 'Record' }
//                             </button>
//                         </p>
//                     </div>
//                 </div>
//             </div>


//             <div className="max-w-lg mx-auto mt-12">
//                 <p className="mb-4">Spoken Text:{text}</p>
//                 <p>Translation:{tranlation}</p>
//             </div>

//         </div>
//     );
// };
// export default Translator;
