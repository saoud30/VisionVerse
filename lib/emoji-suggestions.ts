export type EmojiCategory = 'nature' | 'activity' | 'object' | 'emotion';

export interface EmojiSuggestion {
  emoji: string;
  category: EmojiCategory;
  keywords: string[];
}

export const emojiSuggestions: EmojiSuggestion[] = [
  { emoji: "🌅", category: "nature", keywords: ["sunset", "sunrise", "landscape", "beach"] },
  { emoji: "🎨", category: "activity", keywords: ["art", "creative", "design", "paint"] },
  { emoji: "📸", category: "object", keywords: ["camera", "photo", "photography", "picture"] },
  { emoji: "✨", category: "object", keywords: ["sparkles", "magic", "shine", "stars"] },
  { emoji: "💫", category: "object", keywords: ["stars", "dizzy", "sparkle", "magic"] },
  { emoji: "🌟", category: "object", keywords: ["star", "glow", "shine", "bright"] },
  { emoji: "😊", category: "emotion", keywords: ["happy", "smile", "joy", "pleased"] },
  { emoji: "🔥", category: "object", keywords: ["fire", "hot", "trending", "popular"] }
];

export function suggestEmojis(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
  const suggestions = new Set<string>();

  words.forEach(word => {
    emojiSuggestions.forEach(suggestion => {
      if (suggestion.keywords.some(keyword => word.includes(keyword))) {
        suggestions.add(suggestion.emoji);
      }
    });
  });

  return Array.from(suggestions).slice(0, 5);
}