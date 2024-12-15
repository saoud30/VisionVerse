## Search Engine API Implementation Guide

### API Keys Required

```env
VITE_TOGETHER_API_KEY="your_together_api_key"
VITE_SERPER_API_KEY="your_serper_api_key"
VITE_HELICONE_API_KEY="your_helicone_api_key"
```

### 1. Serper API (Google Search)
- **Purpose**: Fetches search results from Google
- **Documentation**: https://serper.dev/docs
- **Endpoint**: `https://google.serper.dev/search`
- **Headers Required**:
  - `X-API-KEY`: Your Serper API key
  - `Content-Type`: application/json

```typescript
async function searchGoogle(query: string) {
  const response = await axios.post(
    'https://google.serper.dev/search',
    {
      q: query,
      num: 6, // Number of results to return
    },
    {
      headers: {
        'X-API-KEY': import.meta.env.VITE_SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
    }
  );

  // Transform results to a consistent format
  return response.data.organic.map((result: any) => ({
    title: result.title,
    link: result.link,
    snippet: result.snippet,
  }));
}
```

### 2. Together AI API (LLM Processing)
- **Purpose**: Processes search results and generates answers
- **Documentation**: https://docs.together.ai/docs/inference-rest
- **Endpoint**: `https://api.together.xyz/v1/chat/completions`
- **Headers Required**:
  - `Authorization`: Bearer your_together_api_key
  - `Helicone-Auth`: Bearer your_helicone_api_key (for analytics)
  - `Content-Type`: application/json

```typescript
async function getAnswer(query: string, sources: any[]) {
  // Format sources for context
  const sourceText = sources
    .map((source) => `${source.title}\n${source.snippet}`)
    .join('\n\n');

  const response = await axios.post(
    'https://api.together.xyz/v1/chat/completions',
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
```

### 3. Similar Topics Generation
- Uses Together AI to generate related questions
- Same API as answer generation but with different prompt

```typescript
async function getSimilarTopics(query: string) {
  const response = await axios.post(
    'https://api.together.xyz/v1/chat/completions',
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

  // Parse response into array of questions
  const content = response.data.choices[0].message.content;
  return content
    .split('\n')
    .filter((line: string) => line.trim())
    .map((line: string) => line.replace(/^\d+\.\s*/, '').trim());
}
```

### Error Handling Best Practices

```typescript
try {
  const sources = await searchGoogle(query);
  const [answer, similarTopics] = await Promise.all([
    getAnswer(query, sources),
    getSimilarTopics(query),
  ]);

  // Process results
} catch (error) {
  console.error('Search failed:', error);
  // Handle error appropriately
}
```

### API Rate Limits & Considerations

1. **Serper API**:
   - Free tier: 1,000 searches/month
   - Recommended: Implement rate limiting
   - Cache frequent searches if possible

2. **Together AI**:
   - Pay-as-you-go pricing
   - Monitor token usage
   - Consider implementing retry logic for failed requests

3. **Helicone**:
   - Used for monitoring Together AI usage
   - Provides analytics and request tracking
   - No rate limits on the analytics side

### Implementation Tips

1. **Environment Variables**:
   - Always use environment variables for API keys
   - Never expose keys in client-side code
   - Use .env.local for development

2. **Response Caching**:
   - Consider implementing caching for frequent queries
   - Cache both search results and AI responses
   - Set appropriate cache expiration times

3. **Error States**:
   - Implement proper error handling for all API calls
   - Show user-friendly error messages
   - Log errors for debugging

4. **Performance**:
   - Use Promise.all for parallel requests
   - Implement request debouncing for search input
   - Consider implementing request queuing for heavy usage

5. **Security**:
   - Validate user input before sending to APIs
   - Implement rate limiting per user/session
   - Sanitize API responses before displaying