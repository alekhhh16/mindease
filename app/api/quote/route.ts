import { NextResponse } from "next/server";

const QUOTES = [
  "You are worthy of rest, joy, and healing.",
  "Take a deep breath. You are exactly where you need to be.",
  "Progress, not perfection. Every small step counts.",
  "Your feelings are valid. It's okay to not be okay.",
  "Be gentle with yourself. You're doing the best you can.",
  "This moment is temporary. Better days are ahead.",
  "You have survived 100% of your worst days. You're stronger than you think.",
  "It's okay to ask for help. That's a sign of strength, not weakness.",
  "Your mental health matters. Taking care of yourself is not selfish.",
  "One day at a time. One step at a time. One breath at a time.",
  "You are not alone in this journey.",
  "Small progress is still progress.",
  "Your story isn't over yet. Keep going.",
  "Healing is not linear. Be patient with yourself.",
  "You deserve the same kindness you give to others.",
  "Today is a new opportunity to take care of yourself.",
  "Your struggles do not define you. Your strength does.",
  "It's okay to rest. You don't have to earn your breaks.",
  "You are more resilient than you realize.",
  "Every storm runs out of rain. This too shall pass.",
];

export async function GET() {
  // Get a quote based on the day so it changes daily but stays consistent
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const quote = QUOTES[dayOfYear % QUOTES.length];
  
  return NextResponse.json({ quote });
}
