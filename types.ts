
export interface ImageAsset {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number; // In ETHO
  seller: string;
  createdAt: number;
  tags: string[];
}

export interface UserState {
  address: string | null;
  balance: string;
  networkId: string | null;
  isConnecting: boolean;
}

export interface MarketplaceStats {
  totalVolume: number;
  floorPrice: number;
  itemsListed: number;
  owners: number;
}
