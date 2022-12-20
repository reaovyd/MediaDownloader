import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { YoutubeModule } from './youtube/youtube.module';
import { TwitterModule } from './twitter/twitter.module';
import { InstagramModule } from './instagram/instagram.module';
import * as redisStore from 'cache-manager-redis-store';
import type { ClientOpts } from 'redis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    YoutubeModule,
    TwitterModule,
    InstagramModule,
    CacheModule.register<ClientOpts>({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
})
export class AppModule {}
