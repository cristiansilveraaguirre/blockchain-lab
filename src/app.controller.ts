import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { BlockchainService } from './blockchain/blockchain.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly blockchainService: BlockchainService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('transfer')
  async transfer(
    @Body()
    body: {
      to: string;
      amount: string;
    },
  ) {
    return await this.blockchainService.transferEth(
      body.to,
      body.amount,
    );
  }
}
