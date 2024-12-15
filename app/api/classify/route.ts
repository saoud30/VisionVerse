import { NextResponse } from 'next/server';

const models = {
  vit: 'nlpconnect/vit-gpt2-image-captioning',
  blip: 'Salesforce/blip-image-captioning-large',
  llama: 'meta-llama/Llama-3.2-11B-Vision-Instruct',
};

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const images = formData.getAll('images');
    const image = images[0] as File;
    const model = formData.get('model') as keyof typeof models;
    const question = formData.get('question') as string;
    
    if (!image) {
      throw new Error('No image provided');
    }

    const imageBuffer = await image.arrayBuffer();

    if (model === 'llama') {
      // Convert image to base64
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      const imageUrl = `data:${image.type};base64,${base64Image}`;
      
      const response = await fetch(
        'https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-11B-Vision-Instruct/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
          },
          body: JSON.stringify({
            model: models.llama,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: question || 'Describe this image in detail.'
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: imageUrl
                    }
                  }
                ]
              }
            ],
            max_tokens: 500,
            stream: false
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to analyze image');
      }

      const result = await response.json();
      return NextResponse.json({ 
        caption: result.choices[0].message.content 
      });
    } else {
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
        throw new Error(error.error || 'Failed to analyze image');
      }

      const result = await response.json();
      const caption = Array.isArray(result) ? result[0].generated_text : result[0].caption;
      return NextResponse.json({ caption });
    }
  } catch (error) {
    console.error('Image analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze image' },
      { status: 500 }
    );
  }
}