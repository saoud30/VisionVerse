import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface GenerationSettings {
  width: number;
  height: number;
  quality: number;
  style: string;
}

interface AdvancedSettingsProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
}

export function AdvancedSettings({ settings, onSettingsChange }: AdvancedSettingsProps) {
  return (
    <div className="space-y-4 p-4 bg-black/20 rounded-lg">
      <h3 className="text-sm font-medium text-white/80">Advanced Settings</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs text-white/70">Image Quality</label>
          <Slider
            value={[settings.quality]}
            onValueChange={([quality]) => onSettingsChange({ quality })}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-white/70">Width</label>
            <Select
              value={settings.width.toString()}
              onValueChange={(value) => onSettingsChange({ width: parseInt(value) })}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select width" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="512">512px</SelectItem>
                <SelectItem value="768">768px</SelectItem>
                <SelectItem value="1024">1024px</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-white/70">Height</label>
            <Select
              value={settings.height.toString()}
              onValueChange={(value) => onSettingsChange({ height: parseInt(value) })}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select height" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="512">512px</SelectItem>
                <SelectItem value="768">768px</SelectItem>
                <SelectItem value="1024">1024px</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}