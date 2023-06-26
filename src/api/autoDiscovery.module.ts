import { Module } from '@nestjs/common';
import { AutoDiscoveryService } from './autoDiscovery.service';
import { AutoDiscoveryController } from './autoDiscovery.controller';

@Module({
    imports: [],
    controllers: [AutoDiscoveryController],
    providers: [AutoDiscoveryService],
})
export class AutoDiscoveryModule{}
    

