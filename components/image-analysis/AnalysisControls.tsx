import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export interface AnalysisSettings {
  detailedMode: boolean;
  confidenceThreshold: number;
}

interface AnalysisControlsProps {
  settings: AnalysisSettings;
  onSettingsChange: (settings: Partial<AnalysisSettings>) => void;
}

export function AnalysisControls({ settings, onSettingsChange }: AnalysisControlsProps) {
  return (
    <div className="space-y-6 p-4 bg-black/20 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-white">Detailed Analysis</Label>
          <p className="text-sm text-white/70">
            Enable comprehensive image analysis
          </p>
        </div>
        <Switch
          checked={settings.detailedMode}
          onCheckedChange={(detailedMode) => onSettingsChange({ detailedMode })}
          className="data-[state=checked]:bg-white/30"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-white">Confidence Threshold</Label>
        <Slider
          value={[settings.confidenceThreshold]}
          onValueChange={([confidenceThreshold]) => 
            onSettingsChange({ confidenceThreshold })
          }
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
        <p className="text-sm text-white/70">
          Minimum confidence level for analysis results: {settings.confidenceThreshold}%
        </p>
      </div>
    </div>
  );
}