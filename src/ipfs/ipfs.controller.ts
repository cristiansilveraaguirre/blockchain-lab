import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { IpfsService } from './ipfs.service';

@Controller('ipfs')
export class IpfsController {
  constructor(private readonly ipfsService: IpfsService) {}

  @Post('upload-json')
  async uploadJson(@Body() body: { data: any }) {
    const cid = await this.ipfsService.uploadJSON(body.data);
    const url = this.ipfsService.getGatewayUrl(cid);
    
    return {
      success: true,
      cid: cid,
      gatewayUrl: url,
      message: 'JSON subido exitosamente a IPFS'
    };
  }

  @Get(':cid')
  async getUrl(@Param('cid') cid: string) {
    return {
      success: true,
      cid: cid,
      gatewayUrl: this.ipfsService.getGatewayUrl(cid)
    };
  }
}