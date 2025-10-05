import { ComingSoonFeature } from "@/types";

export const COMING_SOON_FEATURES: ComingSoonFeature[] = [
  {
    id: "constellation-view",
    name: "Constellation View",
    description: "Visualize how your thoughts connect across the void",
    icon: "🌌",
    isLocked: true,
  },
  {
    id: "thought-circles",
    name: "Thought Circles",
    description: "Join intimate groups of 5-8 deep thinkers",
    icon: "⭕",
    isLocked: true,
  },
  {
    id: "time-capsules",
    name: "Time Capsules",
    description: "Send thoughts to your future self and community",
    icon: "⏳",
    isLocked: true,
  },
  {
    id: "echo-system",
    name: "Echo System",
    description: "Let profound thoughts ripple through the void",
    icon: "〰️",
    isLocked: true,
  },
  {
    id: "wisdom-archive",
    name: "Wisdom Archive",
    description: "Access curated collection of timeless insights",
    icon: "📚",
    isLocked: true,
  },
  {
    id: "thought-patterns",
    name: "Thought Patterns",
    description: "Discover your unique thinking rhythms and insights",
    icon: "📊",
    isLocked: true,
  },
  {
    id: "digital-sabbath",
    name: "Digital Sabbath",
    description: "Advanced break management and offline celebration",
    icon: "🧘",
    isLocked: true,
  },
  {
    id: "thought-threads",
    name: "Thought Threads",
    description: "Connect your ideas across time and space",
    icon: "🧵",
    isLocked: true,
  },
  {
    id: "deep-engagement",
    name: "Deep Engagement",
    description: "Richer ways to connect: resonate, ponder, question",
    icon: "💫",
    isLocked: true,
  },
];

export const AVAILABLE_FEATURES = [
  "mood-posting",
  "whisper-replies",
  "reflection-prompts",
  "breathing-space",
  "thought-journals",
  "reading-time",
  "seasonal-themes",
  "typography-choice",
  "silence-appreciation",
];

export const checkFeatureAccess = (featureId: string): boolean => {
  return AVAILABLE_FEATURES.includes(featureId);
};
