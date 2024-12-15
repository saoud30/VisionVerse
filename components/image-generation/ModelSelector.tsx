'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-white/10 border-white/20 text-white">
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="fluxRealism">FLUX.1 Realism (Default)</SelectItem>
        <SelectItem value="flux">FLUX.1</SelectItem>
        <SelectItem value="fluxSchnell">FLUX.1 Schnell (Faster)</SelectItem>
        <SelectItem value="fluxAntiBlur">FLUX.1 AntiBlur</SelectItem>
        <SelectItem value="stable">Stable Diffusion 3</SelectItem>
        <SelectItem value="sdxl">Stable Diffusion XL</SelectItem>
      </SelectContent>
    </Select>
  );
}