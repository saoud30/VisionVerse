'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { createWorker, Worker, RecognizeResult } from 'tesseract.js';

export function OCRAnalysis() {
  const [image, setImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setExtractedText('');
        setProgress(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractText = async () => {
    if (!image) return;

    setIsProcessing(true);
    setProgress(0);

    let worker: Worker | null = null; // Declare worker outside of try block

    try {
      worker = await createWorker('eng'); // Create worker with language
      const { data } = await worker.recognize(image);

      if (!data.text.trim()) {
        throw new Error('No text was found in the image');
      }

      setExtractedText(data.text);
      toast({
        title: 'Success',
        description: 'Text extracted successfully!',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error during OCR:', error);
      toast({
        title: 'Error',
        description:
          'Failed to extract text. Please try a different image or check if it contains readable text.',
        variant: 'destructive',
        duration: 5000,
      });
      setExtractedText('');
    } finally {
      if(worker){
          await worker.terminate(); // Terminate worker in finally block
      }
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <label
          htmlFor="ocr-image-upload"
          className="glass-card p-8 w-full max-w-xl cursor-pointer hover:border-purple-500/50 transition-colors"
        >
          <div className="flex flex-col items-center gap-4">
            <Upload className="h-8 w-8 text-purple-400" />
            <p className="text-white/80">Click to upload an image containing text</p>
            <p className="text-white/60 text-sm">Supported formats: PNG, JPEG, BMP</p>
          </div>
          <input
            id="ocr-image-upload"
            type="file"
            accept="image/png,image/jpeg,image/bmp"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

        {image && (
          <div className="w-full max-w-xl space-y-4">
            <div className="relative">
              <img
                src={image}
                alt="Uploaded image"
                className="w-full rounded-lg border border-white/10"
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p>Processing Image...</p>
                  </div>
                </div>
              )}
            </div>
            <Button
              onClick={extractText}
              className="w-full glass-button"
              disabled={isProcessing}
            >
              {isProcessing ? 'Extracting Text...' : 'Extract Text'}
            </Button>
          </div>
        )}

        {extractedText && (
          <div className="w-full max-w-xl glass-card p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-white">Extracted Text:</h3>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(extractedText);
                  toast({
                    title: 'Copied!',
                    description: 'Text copied to clipboard',
                    duration: 2000,
                  });
                }}
                className="glass-button text-sm py-1"
              >
                Copy Text
              </Button>
            </div>
            <p className="text-white/80 whitespace-pre-wrap">{extractedText}</p>
          </div>
        )}
      </div>
    </div>
  );
}