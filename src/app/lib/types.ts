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

  export const relationMap: Record<string, { description: string }> = {
    "V:obj:N": { description: "動詞とその目的語" },
    "V:prep:N": { description: "動詞とその前置詞付き目的語" },
    "V:obj1+2:N": { description: "動詞とその直接目的語と間接目的語" },
    "V:obj+prep:N": { description: "動詞、直接目的語、前置詞付き間接目的語" },
    "V:subj:N": { description: "動詞とその主語" },
    "V:sc:V": { description: "動詞とその従属動詞" },
    "N:mod:A": { description: "名詞とその修飾形容詞" },
    "N:prep:N": { description: "名詞と前置詞句" },
    "N:nn:N": { description: "複合名詞" },
    "V:mod:A": { description: "動詞とその修飾形容詞" },
    "A:mod:A": { description: "形容詞とその修飾副詞" },
};