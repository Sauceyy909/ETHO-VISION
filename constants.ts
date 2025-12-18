
export const ETHO_TOKEN_ADDRESS = "0x62e6387436e02118c708f7Bef980d7960cBa336c";
export const PLATFORM_WALLET_ADDRESS = "0x1A077De405DfD0e0F4fAf447b4a8129c3fE9A3D0";
export const POLYGON_CHAIN_ID = "0x89"; // Mainnet Polygon

export const ETHO_ABI = [
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function balanceOf(address account) public view returns (uint256)",
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
  "function decimals() public view returns (uint8)"
];

export const INITIAL_MOCK_ASSETS = [
  {
    id: "1",
    name: "Cybernetic Horizon",
    description: "A professional architectural rendering of a futuristic cityscape under neon rain.",
    imageUrl: "https://picsum.photos/seed/cyber/800/1000",
    price: 450,
    seller: "0x3A2...fE1",
    createdAt: Date.now() - 100000,
    tags: ["Cyberpunk", "Cityscape", "Professional"]
  },
  {
    id: "2",
    name: "Obsidian Core",
    description: "Minimalist macro photography of raw obsidian fractures. High contrast, professional lighting.",
    imageUrl: "https://picsum.photos/seed/obsidian/800/1000",
    price: 1200,
    seller: "0x7B1...aD4",
    createdAt: Date.now() - 200000,
    tags: ["Macro", "Minimalist", "Black&White"]
  },
  {
    id: "3",
    name: "Liquid Mercury Abstract",
    description: "3D generated fluid simulation with reflective metallic shaders.",
    imageUrl: "https://picsum.photos/seed/mercury/800/1000",
    price: 850,
    seller: "0x1C2...9E2",
    createdAt: Date.now() - 300000,
    tags: ["Abstract", "3D", "Metallic"]
  }
];
