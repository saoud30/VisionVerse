import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CaptionTemplate = {
  name: string;
  template: string;
  tone: 'professional' | 'casual' | 'funny';
  emojis: string[];
};

export const captionTemplates: CaptionTemplate[] = [
  {
    name: "Professional",
    template: "Elevating the everyday through thoughtful design and attention to detail.",
    tone: "professional",
    emojis: ["✨", "🎯", "💫", "📈"]
  },
  {
    name: "Casual",
    template: "Just living my best life! Can't beat this vibe.",
    tone: "casual",
    emojis: ["😊", "🌟", "💕", "✌️"]
  },
  {
    name: "Funny",
    template: "When in doubt, scroll it out! Living that social media life.",
    tone: "funny",
    emojis: ["😂", "🤪", "🎉", "🔥"]
  }
];

interface CaptionTemplatesProps {
  onSelectTemplate: (template: CaptionTemplate) => void;
  activeTemplate?: string;
}

export function CaptionTemplates({ onSelectTemplate, activeTemplate }: CaptionTemplatesProps) {
  return (
    <div className="space-y-4 max-w-full">
      <h3 className="text-sm font-medium text-white/80">Caption Templates</h3>
      <div className="grid gap-3 w-full">
        {captionTemplates.map((template) => (
          <Button
            key={template.name}
            variant="outline"
            className={cn(
              "justify-start h-auto p-4 bg-white/10 hover:bg-white/20 text-white border-white/20 w-full",
              activeTemplate === template.name && "bg-white/30"
            )}
            onClick={() => onSelectTemplate(template)}
          >
            <div className="text-left w-full break-words">
              <div className="font-medium mb-1">{template.name}</div>
              <p className="text-sm text-white/70 whitespace-normal">{template.template}</p>
              <div className="mt-2 text-lg flex flex-wrap gap-1">
                {template.emojis.map((emoji, index) => (
                  <span key={index}>{emoji}</span>
                ))}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}