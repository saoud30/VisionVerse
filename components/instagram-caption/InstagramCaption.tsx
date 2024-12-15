'use client';

import { useState } from 'react';
import { Loader2, Upload, X, Copy, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { CaptionModelSelector } from './CaptionModelSelector';
import { CaptionTemplates, CaptionTemplate, captionTemplates } from './CaptionTemplates';
import { suggestEmojis } from '@/lib/emoji-suggestions';

type Caption = {
  text: string;
  hashtags: string;
};

export function InstagramCaption() {
  const [model, setModel] = useState('vit');
  const [image, setImage] = useState<{ url: string; file: File | null }>({ url: '', file: null });
  const [caption, setCaption] = useState<Caption | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<string>();
  const [suggestedEmojis, setSuggestedEmojis] = useState<string[]>([]);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    setImage({
      url: URL.createObjectURL(file),
      file,
    });
    setCaption(null);
  };

  const removeImage = () => {
    if (image.url) {
      URL.revokeObjectURL(image.url);
    }
    setImage({ url: '', file: null });
    setCaption(null);
  };

  const handleTemplateSelect = (template: CaptionTemplate) => {
    setActiveTemplate(template.name);
    if (caption) {
      const newEmojis = suggestEmojis(template.template);
      setSuggestedEmojis(newEmojis);
      setCaption({
        ...caption,
        text: `${template.template}\n\n${newEmojis.join(' ')}`
      });
    }
  };

  const generateCaption = async () => {
    if (!image.file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', image.file);
      formData.append('model', model);

      const response = await fetch('/api/instagram-caption', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate caption');
      }

      const data = await response.json();
      const newEmojis = suggestEmojis(data.caption);
      setSuggestedEmojis(newEmojis);
      
      setCaption({
        text: `${data.caption}\n\n${newEmojis.join(' ')}`,
        hashtags: data.hashtags
      });

      toast({
        title: 'Caption generated!',
        description: 'Your Instagram caption is ready.',
      });
    } catch (error) {
      console.error('Caption generation error:', error);
      toast({
        title: 'Error generating caption',
        description: error instanceof Error ? error.message : 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      description: 'The caption has been copied to your clipboard.',
    });
  };

  return (
    <Card className="glass-card border-0 p-6 space-y-6">
      <div className="space-y-6">
        <CaptionModelSelector value={model} onChange={setModel} />

        <div className="flex justify-between items-center gap-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="instagram-image-upload"
          />
          <label htmlFor="instagram-image-upload" className="flex-1">
            <Button 
              className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20"
              asChild
            >
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </span>
            </Button>
          </label>
          {image.url && (
            <Button 
              onClick={generateCaption} 
              disabled={loading}
              className="bg-white/20 hover:bg-white/30 text-white border-white/20"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Instagram className="h-4 w-4 mr-2" />
              )}
              Generate Caption
            </Button>
          )}
        </div>

        {image.url && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-xl bg-black/20">
                <img
                  src={image.url}
                  alt="Upload Preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {caption && (
                <div className="bg-black/20 p-4 rounded-lg backdrop-blur-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-semibold">Generated Caption</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/70 hover:text-white"
                      onClick={() => copyToClipboard(`${caption.text}\n\n${caption.hashtags}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-white/90 whitespace-pre-wrap mb-4">{caption.text}</p>
                  <p className="text-white/70 text-sm">{caption.hashtags}</p>
                </div>
              )}
            </div>

            <div className="space-y-6 overflow-hidden">
              <CaptionTemplates 
                onSelectTemplate={handleTemplateSelect}
                activeTemplate={activeTemplate}
              />

              {suggestedEmojis.length > 0 && (
                <div className="bg-black/20 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-white/80 mb-2">Suggested Emojis</h3>
                  <div className="text-2xl space-x-2">
                    {suggestedEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (caption) {
                            setCaption({
                              ...caption,
                              text: `${caption.text} ${emoji}`.trim()
                            });
                          }
                        }}
                        className="hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}