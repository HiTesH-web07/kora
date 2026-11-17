export const CATEGORIES = [
  "Brownies & Cookies",
  "Cakes & Desserts",
  "Waffles & Pancakes",
  "Donuts",
  "Chocolates & Truffles",
  "Gift Boxes",
  "Savoury Bites",
] as const;
export type Category = (typeof CATEGORIES)[number];

export interface Product {
  id: string;
  name: string;
  description: string;
  /** SAMPLE price in INR. Replace with the real menu. */
  price: number;
  category: Category;
  image: string;
  /** CSS object-position, to re-crop a shared photo for different products */
  imagePosition?: string;
  aspect?: "portrait" | "square" | "wide";
  signature?: boolean;
  gifting?: boolean;
}

/**
 * SAMPLE MENU. Names, descriptions and prices are placeholders based on the
 * photographs supplied. Swap in the real menu here; nothing else needs to change.
 * Images live in /public/images; replace the files to upgrade to hi-res originals.
 */
export const products: Product[] = [
  { id: "waffle-quad", name: "Four-Corner Brownie Waffle", description: "A brownie waffle split four ways: cookies & cream, pistachio, Biscoff and chocolate crunch.", price: 249, category: "Waffles & Pancakes", image: "/images/waffle-quad.webp", aspect: "square", signature: true },
  { id: "pancake-waffle-box", name: "Pancake & Waffle Box", description: "Fluffy pancakes and crisp waffles, with dark and white chocolate dips on the side.", price: 349, category: "Waffles & Pancakes", image: "/images/pancake-waffle-box.webp", aspect: "square" },
  { id: "biscoff-waffle", name: "Biscoff Layered Waffle", description: "Waffle layers sandwiched with Biscoff spread, a cookie on top and a chocolate drizzle.", price: 199, category: "Waffles & Pancakes", image: "/images/biscoff-waffle.webp", aspect: "wide" },
  { id: "waffle-cone", name: "Chocolate Drizzle Waffle Cone", description: "Waffle folded into a paper cone, striped with chocolate. Oreo + waffle = happiness.", price: 159, category: "Waffles & Pancakes", image: "/images/waffle-cone.webp", aspect: "portrait" },
  { id: "choco-cookies", name: "Soft Chocolate Cookies", description: "Soft cookies, rich chocolate, pure happiness. Loaded with chocolate chips.", price: 199, category: "Brownies & Cookies", image: "/images/cookies-poster.webp", aspect: "portrait", signature: true },
  { id: "hazelnut-brownie", name: "Hazelnut Brownie Box", description: "A single-serve brownie piped with chocolate and finished with toasted hazelnut.", price: 149, category: "Brownies & Cookies", image: "/images/brownie-box.webp", aspect: "square" },
  { id: "sugar-donuts", name: "Filled Sugar Donuts", description: "Sugar-dusted donuts with a chocolate centre, boxed with chocolate-glazed nutty bites.", price: 299, category: "Donuts", image: "/images/donut-box.webp", aspect: "square", signature: true },
  { id: "molten-donuts", name: "Molten Chocolate Donuts", description: "Soft donuts that spill chocolate the moment you bite in.", price: 229, category: "Donuts", image: "/images/donut-pink.webp", aspect: "portrait" },
  { id: "marble-cake", name: "Marble Chocolate Cake", description: "A chocolate cake with a swirled marble top, ready to be topped with a message.", price: 599, category: "Cakes & Desserts", image: "/images/birthday-cake.webp", aspect: "square", gifting: true },
  { id: "truffle-box", name: "Assorted Truffle Box", description: "Nine hand-finished chocolates with pistachio, rose and white chocolate stripes.", price: 449, category: "Chocolates & Truffles", image: "/images/lotus-green-box.webp", imagePosition: "30% 85%", aspect: "wide", gifting: true },
  { id: "lotus-pink-gift", name: "Pink Lotus Gift Box", description: "Chocolates and two jars of cookies in a lotus-print box. Little bites of happiness.", price: 699, category: "Gift Boxes", image: "/images/lotus-pink-box.webp", aspect: "wide", gifting: true },
  { id: "lotus-green-gift", name: "Green Lotus Gift Box", description: "Nine chocolates and a jar of cookies, beautifully packed for sweet moments.", price: 749, category: "Gift Boxes", image: "/images/lotus-green-box.webp", aspect: "wide", gifting: true },
  { id: "jar-hamper", name: "Cookie, Chocolate & Badam Hamper", description: "Three jars (cookies, chocolates and chocolate-coated badam) in a floral gift bag.", price: 599, category: "Gift Boxes", image: "/images/jar-hamper.webp", aspect: "square", gifting: true },
  { id: "creamy-pasta", name: "Creamy Pasta Cup", description: "A warm cup of creamy pasta with herbs, chilli flakes and cheese.", price: 179, category: "Savoury Bites", image: "/images/pasta-cup.webp", aspect: "square" },
];

export const productById = (id: string) => products.find((p) => p.id === id);
