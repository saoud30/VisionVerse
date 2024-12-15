'use client';

import { useState } from 'react';
import { Loader2, Upload, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { AnalysisModelSelector } from './AnalysisModelSelector';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OCRAnalysis } from './OCRAnalysis';

type ImageAnalysis = {
  imageUrl: string;
  caption: string;
};

export function ImageAnalysis() {
  const [captioningModel, setCaptioningModel] = useState('llama');
  const [question, setQuestion] = useState('What do you see in these images?');
  const [uploadedImages, setUploadedImages] = useState<ImageAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'classify' | 'ocr'>('classify');

  const isBasicModel = captioningModel === 'vit' || captioningModel === 'blip';

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload only image files',
        variant: 'destructive',
      });
      return;
    }

    // Check for model-specific restrictions
    if (isBasicModel && files.length > 1) {
      toast({
        title: 'Multiple images not supported',
        description: 'VIT-GPT2 and BLIP models support single image analysis only. For multiple image analysis, please use Llama Vision model.',
        variant: 'destructive',
      });
      return;
    }

    // For basic models, replace existing images
    if (isBasicModel) {
      // Clear existing images
      uploadedImages.forEach(img => URL.revokeObjectURL(img.imageUrl));
      const newImage = {
        imageUrl: URL.createObjectURL(files[0]),
        caption: '',
      };
      setUploadedImages([newImage]);
    } else {
      // For Llama Vision, append new images
      const newImages: ImageAnalysis[] = await Promise.all(
        files.map(async (file) => ({
          imageUrl: URL.createObjectURL(file),
          caption: '',
        }))
      );
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].imageUrl);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const analyzeAllImages = async () => {
    if (uploadedImages.length === 0) return;

    setLoading(true);
    try {
      const formData = new FormData();
      
      // Handle image upload based on model type
      if (isBasicModel) {
        const response = await fetch(uploadedImages[0].imageUrl);
        const blob = await response.blob();
        formData.append('images', blob);
      } else {
        for (const img of uploadedImages) {
          const response = await fetch(img.imageUrl);
          const blob = await response.blob();
          formData.append('images', blob);
        }
      }
      
      formData.append('model', captioningModel);
      formData.append('question', question);

      const endpoint = isBasicModel ? '/api/classify' : '/api/classify-multiple';
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to analyze images');
      }

      const { caption } = await response.json();
      
      setUploadedImages(prev => 
        prev.map(img => ({ ...img, caption }))
      );

      toast({
        title: 'Images analyzed successfully!',
        description: 'Analysis results are shown below each image.',
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Error analyzing images',
        description: error instanceof Error ? error.message : 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModelChange = (model: string) => {
    setCaptioningModel(model);
    // Clear images when switching to a basic model
    if (model === 'vit' || model === 'blip') {
      uploadedImages.forEach(img => URL.revokeObjectURL(img.imageUrl));
      setUploadedImages([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <Button
          onClick={() => setActiveTab('classify')}
          className={`glass-button ${activeTab === 'classify' ? 'bg-white/20' : ''}`}
        >
          Image Classification
        </Button>
        <Button
          onClick={() => setActiveTab('ocr')}
          className={`glass-button ${activeTab === 'ocr' ? 'bg-white/20' : ''}`}
        >
          Text Extraction (OCR)
        </Button>
      </div>

      {activeTab === 'classify' ? (
        <Card className="glass-card border-0 p-6 space-y-6">
          <div className="space-y-6">
            <AnalysisModelSelector value={captioningModel} onChange={handleModelChange} />

            {isBasicModel && (
              <Alert className="bg-white/10 border-white/20">
                <AlertCircle className="h-4 w-4 text-white" />
                <AlertDescription className="text-white">
                  Please select only one image for analysis with these models. For multiple image analysis, use Llama Vision.
                </AlertDescription>
              </Alert>
            )}

            {captioningModel === 'llama' && (
              <>
                <Alert className="bg-white/10 border-white/20">
                  <AlertCircle className="h-4 w-4 text-white" />
                  <AlertDescription className="text-white">
                    You can analyze one or multiple images with Llama Vision
                  </AlertDescription>
                </Alert>
                <Textarea
                  placeholder="Ask a question about the images..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[80px] bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </>
            )}

            <div className="flex justify-between items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                multiple={!isBasicModel}
              />
              <label htmlFor="image-upload" className="flex-1">
                <Button 
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20"
                  asChild
                >
                  <span>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Upload {isBasicModel ? 'Image' : 'Images'}
                  </span>
                </Button>
              </label>
              {uploadedImages.length > 0 && (
                <Button 
                  onClick={analyzeAllImages} 
                  disabled={loading}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                >
                  Analyze {isBasicModel ? 'Image' : 'All Images'}
                </Button>
              )}
            </div>

            {uploadedImages.length > 0 && (
              <div className="image-grid">
                {uploadedImages.map((img, index) => (
                  <div key={index} className="space-y-3 transform transition-transform hover:scale-[1.02]">
                    <div className="relative rounded-lg overflow-hidden shadow-xl bg-black/20">
                      <img
                        src={img.imageUrl}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full aspect-square object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {img.caption && (
                      <div className="bg-black/20 p-4 rounded-lg backdrop-blur-sm">
                        <p className="text-sm text-white/90 whitespace-pre-wrap">
                          {img.caption}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      ) : (
        <OCRAnalysis />
      )}
    </div>
  );
}