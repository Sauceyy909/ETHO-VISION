
import { ethers } from 'ethers';
import { ETHO_TOKEN_ADDRESS, ETHO_ABI, POLYGON_CHAIN_ID } from '../constants';

export class Web3Service {
  private static instance: Web3Service;
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  private constructor() {
    // Fix: Access window.ethereum safely by casting window to any
    if ((window as any).ethereum) {
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
    }
  }

  public static getInstance(): Web3Service {
    if (!Web3Service.instance) {
      Web3Service.instance = new Web3Service();
    }
    return Web3Service.instance;
  }

  async connect(): Promise<string | null> {
    if (!this.provider) throw new Error("MetaMask not found");
    
    // Request account access
    const accounts = await this.provider.send("eth_requestAccounts", []);
    this.signer = await this.provider.getSigner();
    
    // Ensure on Polygon
    const network = await this.provider.getNetwork();
    if (network.chainId.toString(16) !== POLYGON_CHAIN_ID.replace('0x', '')) {
      try {
        // Fix: Access window.ethereum safely by casting window to any
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: POLYGON_CHAIN_ID }],
        });
      } catch (err: any) {
        if (err.code === 4902) {
          // Chain not added
          // Fix: Access window.ethereum safely by casting window to any
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: POLYGON_CHAIN_ID,
              chainName: 'Polygon Mainnet',
              nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
              rpcUrls: ['https://polygon-rpc.com/'],
              blockExplorerUrls: ['https://polygonscan.com/']
            }]
          });
        }
      }
    }
    
    return accounts[0];
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) return "0";
    const contract = new ethers.Contract(ETHO_TOKEN_ADDRESS, ETHO_ABI, this.provider);
    const balance = await contract.balanceOf(address);
    const decimals = await contract.decimals();
    return ethers.formatUnits(balance, decimals);
  }

  async purchaseImage(amount: number, platformWallet: string): Promise<boolean> {
    if (!this.signer) throw new Error("Wallet not connected");
    
    const contract = new ethers.Contract(ETHO_TOKEN_ADDRESS, ETHO_ABI, this.signer);
    const decimals = await contract.decimals();
    const parsedAmount = ethers.parseUnits(amount.toString(), decimals);
    
    const tx = await contract.transfer(platformWallet, parsedAmount);
    await tx.wait();
    return true;
  }
}
