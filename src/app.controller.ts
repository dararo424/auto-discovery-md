import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  async healthCheck(): Promise<any> {
    return {
      statusCode: 200,
      message: 'Serverli MD Engine is online and healthy!',
    };
  }
}