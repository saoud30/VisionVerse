import axios from 'axios';

const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';
const SERPER_API_URL = 'https://google.serper.dev/search';

export async function searchGoogle(query: string) {
  const response = await axios.post(
    SERPER_API_URL,
    {
      q: query,
      num: 6,
    },
    {
      headers: {
        'X-API-KEY': import.meta.env.VITE_SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.organic.map((result: any) => ({
    title: result.title,
    link: result.link,
    snippet: result.snippet,
  }));
}

export async function getAnswer(query: string, sources: any[]) {
  const sourceText = sources
    .map((source) => `${source.title}\n${source.snippet}`)
    .join('\n\n');

  const response = await axios.post(
    TOGETHER_API_URL,
    {
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. Answer questions based on the provided sources. Be concise and accurate.',
        },
        {
          role: 'user',
          content: `Based on these sources:\n\n${sourceText}\n\nQuestion: ${query}\n\nProvide a concise answer:`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    },
    {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_TOGETHER_API_KEY}`,
        'Helicone-Auth': `Bearer ${import.meta.env.VITE_HELICONE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.choices[0].message.content;
}

export async function getSimilarTopics(query: string) {
  const response = await axios.post(
    TOGETHER_API_URL,
    {
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      messages: [
        {
          role: 'system',
          content: 'Generate 3 related search queries based on the user\'s question. Make them specific and interesting.',
        },
        {
          role: 'user',
          content: `Original question: "${query}"\n\nGenerate 3 related questions:`,
        },
      ],
      temperature: 0.8,
      max_tokens: 200,
    },
    {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_TOGETHER_API_KEY}`,
        'Helicone-Auth': `Bearer ${import.meta.env.VITE_HELICONE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const content = response.data.choices[0].message.content;
  return content
    .split('\n')
    .filter((line: string) => line.trim())
    .map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
}