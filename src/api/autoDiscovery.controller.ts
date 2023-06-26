import { Controller, Get, Query } from '@nestjs/common';
import { AutoDiscoveryService, DeviceInfo } from './autoDiscovery.service';

@Controller('autoDiscovery')
export class AutoDiscoveryController {
    constructor(private readonly autoDiscoveryService: AutoDiscoveryService) {}

    @Get('/autoDiscovery')
    async findDevicesInRange(
        @Query('startIp') startIp: string,
        @Query('endIp') endIp: string,
    ): Promise<DeviceInfo[]> {
        return this.autoDiscoveryService.findDevicesInRange(startIp,endIp);
    }
}