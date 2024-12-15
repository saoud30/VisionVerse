import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PresetStyle = {
  name: string;
  prompt: string;
  description: string;
};

export const presetStyles: PresetStyle[] = [
  {
    name: "Realistic",
    prompt: "ultra realistic, photographic quality, highly detailed",
    description: "Photorealistic style with high detail"
  },
  {
    name: "Artistic",
    prompt: "digital art style, vibrant colors, artistic composition",
    description: "Digital art with vibrant colors"
  },
  {
    name: "Anime",
    prompt: "anime style, cel shaded, manga-inspired",
    description: "Japanese anime/manga style"
  },
  {
    name: "Abstract",
    prompt: "abstract art, geometric shapes, modern composition",
    description: "Modern abstract art style"
  },
  {
    name: "Cinematic",
    prompt: "cinematic lighting, dramatic composition, movie scene",
    description: "Movie-like dramatic scenes"
  }
];

interface GenerationPresetsProps {
  onSelectPreset: (preset: PresetStyle) => void;
  activePreset?: string;
}

export function GenerationPresets({ onSelectPreset, activePreset }: GenerationPresetsProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-white/80">Style Presets</h3>
      <div className="flex flex-wrap gap-2">
        {presetStyles.map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            size="sm"
            className={cn(
              "bg-white/10 hover:bg-white/20 text-white border-white/20",
              activePreset === preset.name && "bg-white/30"
            )}
            onClick={() => onSelectPreset(preset)}
          >
            {preset.name}
          </Button>
        ))}
      </div>
    </div>
  );
}