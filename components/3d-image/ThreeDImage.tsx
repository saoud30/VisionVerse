'use client';

import { useState } from 'react';
import { Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const models = [
  {
    id: 'flux-3dxl-p1',
    name: 'Flux 3DXL P1',
    model: 'strangerzonehf/Flux-3DXL-Partfile-0001',
  },
  {
    id: 'flux-3dxl-c1',
    name: 'Flux 3DXL C1',
    model: 'strangerzonehf/Flux-3DXL-Partfile-C0001',
  },
  {
    id: 'flux-1-schnell',
    name: 'FLUX.1 Schnell',
    model: 'black-forest-labs/FLUX.1-schnell',
  },
];

export function ThreeDImage() {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState(models[2].id);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generate3DImage = async () => {
    if (!prompt) {
      toast({
        title: 'Please enter a prompt',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const modelData = models.find((m) => m.id === selectedModel);
      let processedPrompt = prompt;
      
      // Add model-specific prefixes
      if (selectedModel === 'flux-3dxl-p1') {
        processedPrompt = `3DXLP1, ${prompt}`;
      } else if (selectedModel === 'flux-3dxl-c1' || selectedModel === 'flux-1-schnell') {
        processedPrompt = `3DXLC1, ${prompt}`;
      }

      const response = await fetch('/api/generate-3d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: processedPrompt,
          model: modelData?.model,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setImage(data.image);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate image',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card className="p-4 glass-card space-y-4">
        <div className="space-y-4">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select 3D model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Describe the 3D image you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/70 min-h-[100px] resize-none"
          />

          <Button
            onClick={generate3DImage}
            disabled={loading || !prompt}
            className="w-full bg-white/20 hover:bg-white/30 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate 3D Image
              </>
            )}
          </Button>
        </div>

        {image && (
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <img
              src={image}
              alt="Generated 3D image"
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </Card>
    </div>
  );
}
