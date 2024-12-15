'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AnalysisModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function AnalysisModelSelector({ value, onChange }: AnalysisModelSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-white/10 border-white/20 text-white">
        <SelectValue placeholder="Select analysis model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="llama">Llama Vision (Advanced Analysis, Default)</SelectItem>
        <SelectItem value="blip">BLIP (Detailed Captioning)</SelectItem>
        <SelectItem value="vit">ViT-GPT2 (Basic Captioning)</SelectItem>
      </SelectContent>
    </Select>
  );
}