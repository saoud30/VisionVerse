'use client';

import { useState } from 'react';
import { Loader2, Wand2, Download, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ModelSelector } from './ModelSelector';
import { GenerationPresets, PresetStyle, presetStyles } from './GenerationPresets';
import { AdvancedSettings, GenerationSettings } from './AdvancedSettings';

export function GenerateImage() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('fluxSchnell');
  const [generatedImage, setGeneratedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activePreset, setActivePreset] = useState<string>();
  const [settings, setSettings] = useState<GenerationSettings>({
    width: 512,
    height: 512,
    quality: 7,
    style: 'balanced'
  });
  const { toast } = useToast();

  const handlePresetSelect = (preset: PresetStyle) => {
    setActivePreset(preset.name);
    setPrompt(prev => {
      const basePrompt = prev.split(',')[0] || '';
      return `${basePrompt}, ${preset.prompt}`.trim();
    });
  };

  const generateImage = async () => {
    if (!prompt) {
      toast({
        title: 'Please enter a prompt',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          model,
          settings 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImage(data.image);
      toast({
        title: 'Image generated successfully!',
        description: 'Your image is ready below.',
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: 'Error generating image',
        description: error instanceof Error ? error.message : 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: 'Error downloading image',
        description: 'Failed to download the image',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="glass-card border-0 p-6 space-y-6">
      <div className="space-y-6">
        <ModelSelector value={model} onChange={setModel} />
        
        <GenerationPresets 
          onSelectPreset={handlePresetSelect}
          activePreset={activePreset}
        />

        <div className="flex space-x-2">
          <Input
            placeholder="Enter your prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && generateImage()}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
          <Button 
            onClick={generateImage} 
            disabled={loading}
            className="bg-white/20 hover:bg-white/30 text-white border-white/20"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
            <span className="ml-2">Generate</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>

        {showAdvanced && (
          <AdvancedSettings
            settings={settings}
            onSettingsChange={(newSettings) => 
              setSettings(prev => ({ ...prev, ...newSettings }))
            }
          />
        )}
      </div>

      {generatedImage && (
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-black/20 shadow-xl transform transition-transform hover:scale-[1.02]">
            <img
              src={generatedImage}
              alt="Generated"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={handleDownload} 
              variant="outline" 
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}