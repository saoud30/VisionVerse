import { NextResponse } from 'next/server';

const models = {
  flux: 'black-forest-labs/FLUX.1-dev',
  fluxSchnell: 'black-forest-labs/FLUX.1-schnell',
  fluxAntiBlur: 'Shakker-Labs/FLUX.1-dev-LoRA-AntiBlur',
  fluxRealism: 'XLabs-AI/flux-RealismLora',
  stable: 'stabilityai/stable-diffusion-3-medium-diffusers',
  sdxl: 'stabilityai/stable-diffusion-xl-base-1.0',
};

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { prompt, model } = await req.json();
    const modelUrl = `https://api-inference.huggingface.co/models/${models[model as keyof typeof models]}`;

    const response = await fetch(modelUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      if (contentType?.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate image');
      } else {
        const text = await response.text();
        console.error('Non-JSON error response:', text);
        throw new Error('Invalid response from image generation service');
      }
    }

    if (!contentType?.includes('image/')) {
      throw new Error('Invalid response format: Expected image data');
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const imageFormat = contentType.split('/')[1] || 'jpeg';
    
    return NextResponse.json({ 
      image: `data:image/${imageFormat};base64,${base64}` 
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    );
  }
}