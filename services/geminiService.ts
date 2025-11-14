import { GoogleGenAI, Type } from "@google/genai";
import { StudyTipWithVideo, QuickAnswerResponse } from "../App";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

const callGemini = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate content from Gemini API.");
    }
};

export const generateStudyTips = async (subject: string): Promise<StudyTipWithVideo[]> => {
    const isGeneral = subject === 'Dicas Gerais para o ENEM';

    const prompt = isGeneral
      ? `Gere 3 dicas de estudo GERAIS e práticas para o ENEM, aplicáveis a qualquer estudante. Foque em estratégias de prova, gerenciamento de tempo, e saúde mental. Para CADA dica, forneça também uma sugestão de vídeo relevante do YouTube que aprofunde o tópico da dica (ex: vídeo sobre técnica pomodoro, como controlar a ansiedade, etc.).
      
      A sua resposta DEVE ser um objeto JSON com uma chave "dicas".
      O valor de "dicas" deve ser um array onde cada objeto contém:
      1.  Uma chave "tip" com o texto da dica de estudo em formato markdown.
      2.  Uma chave "video" que é um objeto contendo "title" (título do vídeo), "description" (breve descrição do vídeo), e "query" (termos de busca para o YouTube).`
      : `Gere 3 dicas de estudo práticas para a matéria de "${subject}" do ENEM. Para CADA dica, forneça também uma sugestão de vídeo relevante do YouTube que aprofunde o tópico da dica.

      A sua resposta DEVE ser um objeto JSON com uma chave "dicas".
      O valor de "dicas" deve ser um array onde cada objeto contém:
      1.  Uma chave "tip" com o texto da dica de estudo em formato markdown (use uma lista numerada para a dica principal).
      2.  Uma chave "video" que é um objeto contendo "title" (título do vídeo), "description" (breve descrição do vídeo), e "query" (termos de busca para o YouTube).`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            dicas: {
                type: Type.ARRAY,
                description: "Uma lista de 3 dicas de estudo com vídeos.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        tip: {
                            type: Type.STRING,
                            description: "O texto da dica de estudo, formatado em markdown."
                        },
                        video: {
                            type: Type.OBJECT,
                            properties: {
                                title: {
                                    type: Type.STRING,
                                    description: "Título chamativo e relevante para o vídeo."
                                },
                                description: {
                                    type: Type.STRING,
                                    description: "Uma breve descrição (1-2 frases) sobre os tópicos que o vídeo deve abordar."
                                },
                                query: {
                                    type: Type.STRING,
                                    description: "Termos de busca otimizados para encontrar este vídeo no YouTube."
                                }
                            },
                            required: ["title", "description", "query"]
                        }
                    },
                    required: ["tip", "video"]
                }
            }
        },
        required: ["dicas"]
    };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });

        const jsonString = response.text.trim();
        const parsed = JSON.parse(jsonString);
        return parsed.dicas || [];
    } catch (error) {
        console.error("Error calling Gemini API for study tips:", error);
        throw new Error("Failed to generate study tips from Gemini API.");
    }
};


export const generateStudySchedule = (routine: string): Promise<string> => {
    const prompt = `Crie um cronograma de estudos semanal detalhado para o ENEM, de segunda a domingo, baseado na seguinte rotina do estudante: "${routine}". O cronograma deve ser realista, equilibrando estudos com descanso. Distribua as matérias do ENEM (Linguagens, Ciências Humanas, Ciências da Natureza, Matemática e Redação) de forma equilibrada ao longo da semana, sugerindo horários e atividades específicas (ex: "14h-15h: Matemática - Estudar Funções", "15h-15:15h: Pausa"). Apresente o cronograma em formato de tabela Markdown.`;
    return callGemini(prompt);
};

export const generateTriScoreSimulation = (scores: { [key: string]: number }): Promise<string> => {
    const prompt = `Aja como um especialista no ENEM e na Teoria de Resposta ao Item (TRI). Com base nos dados a seguir, forneça uma simulação de nota para o ENEM.
    
    Acertos:
    - Linguagens e Códigos: ${scores.linguagens} de 45
    - Ciências Humanas: ${scores.humanas} de 45
    - Ciências da Natureza: ${scores.natureza} de 45
    - Matemática: ${scores.matematica} de 45
    - Nota da Redação: ${scores.redacao} (de 1000)

    Sua resposta deve:
    1.  Apresentar uma **estimativa de pontuação (uma faixa, ex: 650-700)** para cada uma das quatro áreas de conhecimento, explicando brevemente que a TRI considera a coerência das respostas, não apenas o número de acertos.
    2.  Calcular a **média simples** final com base no ponto médio da faixa estimada de cada área e a nota da redação.
    3.  Fornecer uma breve **análise do resultado**, indicando para quais tipos de cursos e universidades essa média seria competitiva.
    4.  Incluir um **aviso em negrito** no final: "**Atenção: Esta é uma simulação e não representa a sua nota oficial. A pontuação TRI real depende do padrão de respostas de todos os participantes do exame.**"
    
    Formate a resposta usando Markdown para clareza (títulos, listas e negrito).`;
    return callGemini(prompt);
};

export const generateQuickAnswer = async (question: string): Promise<QuickAnswerResponse> => {
    const prompt = `Responda à seguinte dúvida sobre o ENEM de forma clara e concisa. Além disso, avalie se a pergunta poderia ser melhor respondida ou complementada por um vídeo. Se, e somente se, um vídeo for altamente relevante (ex: para explicações visuais, resolução de problemas passo a passo), forneça uma sugestão de vídeo do YouTube.

    Dúvida do aluno: "${question}"

    A sua resposta DEVE ser um objeto JSON. Não inclua a sugestão de vídeo se não for estritamente necessário.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            answerText: {
                type: Type.STRING,
                description: "A resposta em texto para a pergunta do aluno, em formato markdown."
            },
            video: {
                type: Type.OBJECT,
                description: "Uma sugestão de vídeo opcional, apenas se for altamente relevante.",
                properties: {
                    title: {
                        type: Type.STRING,
                        description: "Título chamativo e relevante para o vídeo."
                    },
                    description: {
                        type: Type.STRING,
                        description: "Uma breve descrição (1-2 frases) sobre os tópicos que o vídeo deve abordar."
                    },
                    query: {
                        type: Type.STRING,
                        description: "Termos de busca otimizados para encontrar este vídeo no YouTube."
                    }
                },
                required: ["title", "description", "query"]
            }
        },
        required: ["answerText"]
    };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error calling Gemini API for quick answer:", error);
        throw new Error("Failed to generate quick answer from Gemini API.");
    }
};