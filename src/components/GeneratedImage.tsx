import React from 'react';
import { Download, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface GeneratedImageProps {
  imageUrl: string;
  prompt: string;
}

export function GeneratedImage({ imageUrl, prompt }: GeneratedImageProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Generated Image',
          text: `Check out this AI-generated image: ${prompt}`,
          url: imageUrl
        });
      } else {
        await navigator.clipboard.writeText(imageUrl);
        toast.success('Image URL copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to share image');
    }
  };

  return (
    <div className="container glass-card rounded-xl p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase text-blue-900">Generated Image:</h2>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-blue-50 rounded-full transition-colors"
            title="Download image"
          >
            <Download className="w-5 h-5 text-blue-600" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 hover:bg-blue-50 rounded-full transition-colors"
            title="Share image"
          >
            <Share2 className="w-5 h-5 text-blue-600" />
          </button>
        </div>
      </div>
      <div className="relative aspect-square w-full max-w-2xl mx-auto overflow-hidden rounded-lg">
        <img
          src={imageUrl}
          alt={prompt}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="mt-4 text-sm text-gray-600 text-center italic">
        "{prompt}"
      </p>
    </div>
  );
}