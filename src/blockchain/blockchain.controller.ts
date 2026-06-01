import { Controller, Get, Post, Body } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

@Controller('api')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('token-info')
  async getTokenInfo() {
    const data = await this.blockchainService.getAllInfo();
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('transfer')
  async transfer(@Body() body: { to: string; amount: string }) {
    const tx = await this.blockchainService.transferEth(
      body.to,
      body.amount,
    );

    return {
      success: true,
      data: tx,
    };
  }
}