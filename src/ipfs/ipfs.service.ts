import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const PinataSDK = require('@pinata/sdk');

@Injectable()
export class IpfsService {
  private pinata: any;

  constructor(private configService: ConfigService) {
    const jwt = this.configService.get<string>('PINATA_JWT');
    this.pinata = new PinataSDK({ pinataJWTKey: jwt });
  }

  // Subir JSON
  async uploadJSON(data: any): Promise<string> {
    const result = await this.pinata.pinJSONToIPFS(data);
    console.log(`📦 JSON subido - CID: ${result.IpfsHash}`);
    return result.IpfsHash;
  }

  // Subir archivo (imagen, texto, etc.)
  async uploadFile(filePath: string): Promise<string> {
    const fs = require('fs');
    const stream = fs.createReadStream(filePath);
    const result = await this.pinata.pinFileToIPFS(stream);
    console.log(`📦 Archivo subido - CID: ${result.IpfsHash}`);
    return result.IpfsHash;
  }

  // Obtener URL del gateway
  getGatewayUrl(cid: string): string {
    return `https://gateway.pinata.cloud/ipfs/${cid}`;
  }
}