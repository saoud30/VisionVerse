import { NextResponse } from 'next/server';

const models = {
  vit: 'nlpconnect/vit-gpt2-image-captioning',
  git: 'microsoft/git-base',
};

const hashtagPrompt = (caption: string) => {
  const words = caption.toLowerCase().split(' ');
  const hashtags = words
    .filter(word => word.length > 3)
    .map(word => `#${word.replace(/[^a-z0-9]/g, '')}`)
    .slice(0, 8)
    .join(' ');
  
  return `${hashtags} #photography #instagram #photooftheday`;
};

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    const model = formData.get('model') as keyof typeof models;
    
    if (!image) {
      throw new Error('No image provided');
    }

    const imageBuffer = await image.arrayBuffer();

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${models[model]}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
        },
        body: imageBuffer,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate caption');
    }

    const result = await response.json();
    const caption = Array.isArray(result) ? result[0].generated_text : result[0].caption;
    const hashtags = hashtagPrompt(caption);

    return NextResponse.json({ 
      caption,
      hashtags,
    });
  } catch (error) {
    console.error('Caption generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate caption' },
      { status: 500 }
    );
  }
}