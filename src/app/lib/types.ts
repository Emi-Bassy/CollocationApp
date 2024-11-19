export interface CollocationResult {
    collocation: string;
    score: number;
    frequency: number;
    relation: string;
    examples: string[];
    onClose: () => void;
  }
  
  export interface APIResponse {
    collocations: CollocationResult[];
    error?: string;
  }

  export const relationMap: Record<string, { description: string; example: string }> = {
    "V:obj:N": { description: "動詞とその目的語", example: "eat dinner (夕食を食べる)" },
    "V:prep:N": { description: "動詞とその前置詞付き目的語", example: "drive by car (車で運転する)" },
    "V:obj1+2:N": { description: "動詞とその直接目的語と間接目的語", example: "give John money (ジョンにお金を渡す)" },
    "V:obj+prep:N": { description: "動詞、直接目的語、前置詞付き間接目的語", example: "give money to John (ジョンにお金を渡す)" },
    "V:subj:N": { description: "動詞とその主語", example: "orse gallop (馬が駆ける)" },
    "V:sc:V": { description: "動詞とその従属動詞", example: "let move (動かせる)" },
    "N:mod:A": { description: "名詞とその修飾形容詞", example: "good friend (良い友達)" },
    "N:prep:N": { description: "名詞と前置詞句", example: "cloud of smoke (煙の雲)" },
    "N:nn:N": { description: "複合名詞", example: "power plant (発電所)" },
    "V:mod:A": { description: "動詞とその修飾形容詞", example: "work hard (懸命に働く)" },
    "A:mod:A": { description: "形容詞とその修飾副詞", example: "really practical (とても実用的)" },
};