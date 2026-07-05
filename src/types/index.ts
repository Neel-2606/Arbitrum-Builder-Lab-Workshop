// Shared TypeScript types for ChainLens

export interface Coin {
  id: string;         // coingecko id (e.g. "ethereum")
  symbol: string;     // e.g. "ETH"
  name: string;       // e.g. "Ethereum"
  price: number;
  change24h: number;
  marketCap: number;
  lastUpdated: number;
  sparkline: number[]; // 7d hourly prices
  image?: string;
}

export interface ConceptSide {
  title: string;
  tone: "muted" | "brand" | "cyan" | "danger" | "orange";
  icon: string; // lucide icon name
  bullets: string[];
}

export interface Concept {
  id: string;
  eyebrow: string;
  left: ConceptSide;
  right: ConceptSide;
}

export interface Block {
  index: number;
  data: string;
  nonce: number;
  previousHash: string;
  hash: string;
  mining: boolean;
}
