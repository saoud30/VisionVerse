import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, model } = await request.json();

    if (!prompt || !model) {
      return NextResponse.json(
        { error: 'Prompt and model are required' },
        { status: 400 }
      );
    }

    console.log('Making request to Hugging Face API:', {
      model,
      promptLength: prompt.length,
    });

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: 'POST',
        headers: {
          Accept: 'image/png',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`API responded with status ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    console.log('Response content type:', contentType);

    const buffer = await response.arrayBuffer();
    
    if (buffer.byteLength === 0) {
      throw new Error('Received empty response from API');
    }

    const base64Image = Buffer.from(buffer).toString('base64');
    const image = `data:image/png;base64,${base64Image}`;

    return NextResponse.json({ image });
  } catch (error) {
    console.error('Error in generate-3d:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate 3D image' },
      { status: 500 }
    );
  }
}