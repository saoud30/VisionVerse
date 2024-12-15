import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const images = formData.getAll('images') as File[];
    const model = formData.get('model') as string;
    const question = formData.get('question') as string;
    
    if (!images || images.length === 0) {
      throw new Error('No images provided');
    }

    // For Llama Vision, we need to analyze all images together
    if (model === 'llama') {
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const buffer = await image.arrayBuffer();
          const base64 = Buffer.from(buffer).toString('base64');
          return `data:${image.type};base64,${base64}`;
        })
      );

      const messages = [
        {
          role: 'user',
          content: [
            { type: 'text', text: question || 'Describe these images in detail and compare them.' },
            ...imageUrls.map(url => ({
              type: 'image_url',
              image_url: { url }
            }))
          ]
        }
      ];

      const response = await fetch(
        'https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-11B-Vision-Instruct/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
          },
          body: JSON.stringify({
            messages,
            max_tokens: 1000,
            stream: false
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to analyze images');
      }

      const result = await response.json();
      return NextResponse.json({ 
        caption: result.choices[0].message.content 
      });
    }

    throw new Error('Multiple image analysis is only supported with Llama Vision');
  } catch (error) {
    console.error('Image analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze images' },
      { status: 500 }
    );
  }
}