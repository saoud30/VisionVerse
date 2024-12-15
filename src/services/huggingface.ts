import axios from 'axios';

const HF_API_URL = 'https://api-inference.huggingface.co/models';
const HF_TOKEN = import.meta.env.VITE_HUGGINGFACE_TOKEN;

export async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await axios.post(
      `${HF_API_URL}/prithivMLmods/Flux-Realism-FineDetailed`,
      { inputs: prompt },
      {
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    // Convert ArrayBuffer to base64 string in browser environment
    const bytes = new Uint8Array(response.data);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64Image = btoa(binary);
    return `data:image/jpeg;base64,${base64Image}`;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Image generation failed: ${error.response?.data?.error || error.message}`);
    }
    throw new Error('Failed to generate image. Please try again.');
  }
}

export async function analyzeImage(imageUrl: string, prompt: string) {
  try {
    const response = await axios.post(
      `${HF_API_URL}/meta-llama/Llama-3.2-11B-Vision-Instruct/v1/chat/completions`,
      {
        model: "meta-llama/Llama-3.2-11B-Vision-Instruct",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ],
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error('Failed to analyze image. Please try again.');
  }
}

export async function detectObjects(imageBlob: Blob) {
  try {
    const response = await axios.post(
      `${HF_API_URL}/facebook/detr-resnet-50`,
      imageBlob,
      {
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/octet-stream'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to detect objects in image. Please try again.');
  }
}

export async function classifyImage(imageBlob: Blob) {
  try {
    const response = await axios.post(
      `${HF_API_URL}/google/vit-base-patch16-224`,
      imageBlob,
      {
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/octet-stream'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to classify image. Please try again.');
  }
}

export async function answerQuestion(question: string, context: string) {
  try {
    const response = await axios.post(
      `${HF_API_URL}/deepset/roberta-base-squad2`,
      {
        inputs: { question, context }
      },
      {
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to answer question. Please try again.');
  }
}

export async function explainCode(code: string) {
  try {
    const response = await axios.post(
      `${HF_API_URL}/microsoft/unixcoder-base`,
      {
        inputs: code
      },
      {
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to explain code. Please try again.');
  }
}