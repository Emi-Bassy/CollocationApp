export const handleSpeak = (text: string) => {
    if (!text) return;
  
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
  
    // ユーザーの設定をlocalStorageから取得
    const preferences = JSON.parse(localStorage.getItem("speechPreferences") || "{}");
  
    // 設定を適用
    utterance.pitch = preferences.pitch || 1;
    utterance.rate = preferences.rate || 1;
    utterance.volume = preferences.volume || 1;

    // デフォルトの音声を使用
    const voices = synth.getVoices();
    const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
    utterance.voice =  englishVoice || null; 

    synth.speak(utterance);
  };