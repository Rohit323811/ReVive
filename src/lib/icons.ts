import {
  Archive,
  BookOpen,
  Box,
  CupSoda,
  Flower,
  Flower2,
  Grid3x3,
  Hand,
  Heart,
  Home,
  Lamp,
  Leaf,
  Lightbulb,
  Package,
  Paintbrush,
  Palette,
  Recycle,
  Shirt,
  ShoppingBag,
  Sparkles,
  Sprout,
  Utensils,
  Wallet,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

/**
 * Emoji → lucide icon mapping. Keeps the UI consistent (real icons) while the
 * data layer stays emoji-based for demo speed.
 */
const MAP: Record<string, LucideIcon> = {
  '🧴': CupSoda,
  '📦': Package,
  '🫙': Archive,
  '👕': Shirt,
  '🥫': Utensils,
  '🪵': Box,
  '🥡': CupSoda,

  '🌱': Sprout,
  '🏠': Home,
  '🎨': Palette,
  '🗂️': Grid3x3,
  '🐱': Heart,
  '🥬': Leaf,
  '🥣': ShoppingBag,
  '💡': Lightbulb,
  '🌸': Flower2,
  '👜': ShoppingBag,
  '🧶': Wrench,
  '🧽': Hand,
  '🕯️': Lamp,
  '🌿': Flower,
  '🍴': Utensils,
  '📚': BookOpen,
  '🛋️': Home,
  '🪴': Flower,
  '🧰': Wrench,

  '♻️': Recycle,
  '💰': Wallet,
  '✨': Sparkles,
  '🔥': Paintbrush,
  '🌍': Leaf,
}

export function iconFor(emoji: string | undefined): LucideIcon {
  return (emoji && MAP[emoji]) || Leaf
}
