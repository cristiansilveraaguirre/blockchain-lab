import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class BlockchainService implements OnModuleInit {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private readContract: ethers.Contract;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    // =========================
    // 1. ENV VARIABLES
    // =========================
    const rpcUrl = this.configService.get<string>('RPC_URL');
    const privateKey = this.configService.get<string>('PRIVATE_KEY');

    if (!rpcUrl) {
      throw new Error('RPC_URL no configurada en .env');
    }

    if (!privateKey) {
      throw new Error('PRIVATE_KEY no configurada en .env');
    }

    // =========================
    // 2. PROVIDER (Alchemy / Sepolia)
    // =========================
    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    // =========================
    // 3. WALLET (firmante)
    // =========================
    this.wallet = new ethers.Wallet(privateKey, this.provider);

    console.log(`🔐 Wallet cargada: ${this.wallet.address}`);

    // =========================
    // 4. CONTRACT (READ ONLY)
    // =========================
    const abi = [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function totalSupply() view returns (uint256)',
    ];

    const address = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';

    this.readContract = new ethers.Contract(
      address,
      abi,
      this.provider,
    );

    console.log('✅ Conectado a Sepolia');
    console.log(`📄 Contrato USDC: ${address}`);
  }

  // =========================
  // READ METHODS
  // =========================
  async getName(): Promise<string> {
    return await this.readContract.name();
  }

  async getSymbol(): Promise<string> {
    return await this.readContract.symbol();
  }

  async getTotalSupply(): Promise<string> {
    const supply = await this.readContract.totalSupply();
    return ethers.formatUnits(supply, 6);
  }

  async getAllInfo() {
    const [name, symbol, totalSupply] = await Promise.all([
      this.getName(),
      this.getSymbol(),
      this.getTotalSupply(),
    ]);

    return {
      name,
      symbol,
      totalSupply,
      network: 'Sepolia',
    };
  }

  // =========================
  // WRITE METHOD (ETH TRANSFER)
  // =========================
  async transferEth(to: string, amount: string) {
    try {
      if (!ethers.isAddress(to)) {
        throw new Error('Dirección inválida');
      }

      const tx = await this.wallet.sendTransaction({
        to,
        value: ethers.parseEther(amount),
      });

      console.log('📨 Tx enviada:', tx.hash);

      const receipt = await tx.wait();

      console.log('✅ Bloque minado:', receipt?.blockNumber);

      return {
        txHash: tx.hash,
        status: receipt?.status,
        blockNumber: receipt?.blockNumber,
      };
    } catch (error) {
      console.error('❌ Error en transferencia:', error);
      throw error;
    }
  }
}