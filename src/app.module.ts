import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AutoDiscoveryModule } from './api/autoDiscovery.module';
import { AutoDiscoveryService } from './api/autoDiscovery.service';

@Module({
  imports: [AutoDiscoveryModule],
  controllers: [AppController],
  providers: [AutoDiscoveryService],
})
export class AppModule {}
