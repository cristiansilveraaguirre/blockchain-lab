import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class BlockchainService implements OnModuleInit {
  private provider: any;
  private contract: any;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    // Obtener la URL de RPC desde .env
    const rpcUrl = this.configService.get<string>('RPC_URL');
    
    // Conectar a la red Sepolia
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    
    // ABI del contrato USDC
    const abi = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function totalSupply() view returns (uint256)"
    ];
    
    // Dirección del contrato USDC en Sepolia
    const address = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
    
    // Conectar al contrato
    this.contract = new ethers.Contract(address, abi, this.provider);
    
    console.log('✅ Conectado a Sepolia');
    console.log(`📄 Contrato USDC: ${address}`);
  }

  async getName() {
    return await this.contract.name();
  }

  async getSymbol() {
    return await this.contract.symbol();
  }

  async getTotalSupply() {
    const supply = await this.contract.totalSupply();
    return ethers.formatUnits(supply, 6);
  }

  async getAllInfo() {
    const [name, symbol, totalSupply] = await Promise.all([
      this.getName(),
      this.getSymbol(),
      this.getTotalSupply()
    ]);

    return {
      name,
      symbol,
      totalSupply,
      network: 'Sepolia'
    };
  }
}