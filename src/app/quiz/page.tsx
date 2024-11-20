"use client"

import { useState } from "react";

const Translator = () => {
    const isActive = false;
    const isSpeechDetected = false;
    const language = 'ja-JP';
    const [text, setText] = useState<string>();    // 認識されたテキストを保存
    const [tranlation, setTranslation] = useState<string>();    // 翻訳されたテキストを保存

    // 録音を処理する関数
    function handleOnRecord() {
        console.log("Recording started");

        // クロスブラウザ対応のため、SpeechRecognition オブジェクトを取得
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        // Speech Recognition API のインスタンスを生成
        const recognition = new SpeechRecognition();

        recognition.lang = 'en-US'

        recognition.onresult = async function (event) {
            // ログとして書き出し中身を確認
            console.log("event", event);

            // 認識されたテキストを取得
            const transcript = event.results[0][0].transcript;

            // 認識されたテキストを保存
            setText(transcript);

            // 翻訳をリクエスト
            const results = await fetch("api/translate", {
                method: "POST",
                body: JSON.stringify({
                    text: transcript,
                    language: language,
                }),
            }).then((r) => r.json());

            // 翻訳されたテキストを保存
            setTranslation(results.text);
        };

        // 録音を開始
        recognition.start();
    }

    return (
        <div className="mt-12 px-4">
            <div className="max-w-lg rounded-xl overflow-hidden mx-auto">
                <div className="bg-zinc-200 p-4 border-b-4 border-zinc-300">
                    <div className="bg-blue-200 rounded-lg p-2 border-2 border-blue-300">
                        <ul className="font-mono font-bold text-blue-900 uppercase px-4 py-2 border border-blue-800 rounded">
                            <li>
                                &gt; Translation Mode: 
                            </li>
                            <li>
                                &gt; Dialect:
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="bg-zinc-800 p-4 border-b-4 border-zinc-950">
                    <p className="flex items-center gap-3">
                        <span className={`block rounded-full w-5 h-5 flex-shrink-0 flex-grow-0 ${isActive ? 'bg-red-500' : 'bg-red-900'} `}>
                            <span className="sr-only">{ isActive ? 'Actively recording' : 'Not actively recording' }</span>
                        </span>
                        <span className={`block rounded w-full h-5 flex-grow-1 ${isSpeechDetected ? 'bg-green-500' : 'bg-green-900'}`}>
                            <span className="sr-only">{ isSpeechDetected ? 'Speech is being recorded' : 'Speech is not being recorded' }</span>
                        </span>
                    </p>
                </div>

                <div className="bg-zinc-800 p-4">
                    <div className="grid sm:grid-cols-2 gap-4 max-w-lg bg-zinc-200 rounded-lg p-5 mx-auto">
                        <p>
                            <button
                                className={`w-full h-full uppercase font-semibold text-sm  ${isActive ? 'text-white bg-red-500' : 'text-zinc-400 bg-zinc-900'} color-white py-3 rounded-sm`}
                                onClick={handleOnRecord}
                                >
                                { isActive ? 'Stop' : 'Record' }
                            </button>
                        </p>
                    </div>
                </div>
            </div>


            <div className="max-w-lg mx-auto mt-12">
                <p className="mb-4">Spoken Text:{text}</p>
                <p>Translation:{tranlation}</p>
            </div>

        </div>
    );
};
export default Translator;
