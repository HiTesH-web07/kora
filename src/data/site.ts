/**
 * Editable site copy and business details.
 * Everything marked PLACEHOLDER should be replaced with the founders' real words / details.
 */
export const site = {
  name: "Kōra Bakehouse",
  founders: ["Rainy", "Kashika"],
  tagline: "Two friends. One little idea. A whole lot of sweetness.",
  subline: "Made with love, served with a little extra happiness.",
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/kora_bakehouse/",
  instagramHandle: "@kora_bakehouse",
  location: "Mahalaxmi Nagar Main Gate, Inside The Bro Code Chopati",
  // PLACEHOLDER story copy. Keep editable until the founders share their real story.
  story: {
    heading: "Meet Rainy & Kashika",
    body:
      "It started with two friends, a little idea and the courage to try something different. Somewhere between the experiments, the desserts and countless little moments, Kora came to life.",
    notes: ["A little idea, a lot of batter.", "Friends first. Bakers second.", "Every box packed like a present."],
  },
};
