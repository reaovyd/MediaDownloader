import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { YoutubeModule } from './youtube/youtube.module';
import { TwitterModule } from './twitter/twitter.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), YoutubeModule, TwitterModule],
})
export class AppModule {}
