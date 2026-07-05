import type { Concept } from "@/types";

export const concepts: Concept[] = [
  {
    id: "web2-vs-web3",
    eyebrow: "The Internet, Rewritten",
    left: {
      title: "Web2",
      tone: "muted",
      icon: "Server",
      bullets: [
        "Centralized — controlled by big companies",
        "Your data lives on company servers",
        "Platforms own your content & identity",
        "Trust the company to behave",
      ],
    },
    right: {
      title: "Web3",
      tone: "brand",
      icon: "Globe",
      bullets: [
        "Decentralized — runs on peer networks",
        "You own your data via your wallet",
        "Users own content, identity & assets",
        "Trust is enforced by code & math",
      ],
    },
  },
  {
    id: "eth-vs-btc",
    eyebrow: "Two Foundational Chains",
    left: {
      title: "Bitcoin",
      tone: "orange",
      icon: "Bitcoin",
      bullets: [
        "Purpose: digital money / store of value",
        "Limited scripting — designed for payments",
        "Proof of Work consensus",
        '"Digital gold"',
      ],
    },
    right: {
      title: "Ethereum",
      tone: "brand",
      icon: "Cpu",
      bullets: [
        "Purpose: programmable world computer",
        "Smart contracts & dApps",
        "Proof of Stake consensus",
        "Powers DeFi, NFTs, and Layer 2s",
      ],
    },
  },
  {
    id: "keys",
    eyebrow: "Cryptographic Identity",
    left: {
      title: "Public Key",
      tone: "cyan",
      icon: "KeyRound",
      bullets: [
        "Like your bank account number",
        "Safe to share with anyone",
        "Used to RECEIVE funds",
        "Derived from the private key",
      ],
    },
    right: {
      title: "Private Key",
      tone: "danger",
      icon: "Lock",
      bullets: [
        "Like your password — NEVER share",
        "Proves ownership & signs transactions",
        "Whoever holds it controls the funds",
        "Lose it and access is gone forever",
      ],
    },
  },
  {
    id: "chain-vs-db",
    eyebrow: "Storage, Reimagined",
    left: {
      title: "Traditional Database",
      tone: "muted",
      icon: "Database",
      bullets: [
        "Controlled by a single owner/admin",
        "Data can be edited or deleted",
        "Centralized, private",
        "Trust the operator",
      ],
    },
    right: {
      title: "Blockchain",
      tone: "brand",
      icon: "Link2",
      bullets: [
        "Distributed across many nodes",
        "Append-only — practically immutable",
        "Transparent & publicly verifiable",
        "Trust the network, not one party",
      ],
    },
  },
];
