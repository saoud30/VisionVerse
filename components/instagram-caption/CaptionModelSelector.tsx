'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CaptionModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CaptionModelSelector({ value, onChange }: CaptionModelSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-white/10 border-white/20 text-white">
        <SelectValue placeholder="Select caption model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="vit">ViT-GPT2 (Creative Captions)</SelectItem>
        <SelectItem value="git">GIT (Detailed Descriptions)</SelectItem>
      </SelectContent>
    </Select>
  );
}