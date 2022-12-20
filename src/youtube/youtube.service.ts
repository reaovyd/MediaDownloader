import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
const youtubeDl = require('youtube-dl-exec');

@Injectable()
export class YoutubeService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async getYoutubeLink(link: string): Promise<string> {
    if (link == undefined || link.length == 0) {
      throw new Error('Invalid link argument was passed');
    }
    const cacheObj: string = await this.cacheManager.get(link);
    if (cacheObj != null) {
      return cacheObj;
    }
    // doesn't scale on
    // combining audio and mp4 implicitly could be a cpu bottleneck
    // TODO can store in a redis/memory cache

    try {
      const res = await youtubeDl(link, {
        skipDownload: true,
        format: 'mp4',
        getUrl: true,
      });
      const storeObj = await Promise.resolve(res);
      await this.cacheManager.set(link, storeObj, { ttl: 5 * 60 });
      return storeObj;
    } catch (err) {
      return Promise.reject('Invalid link: was not searchable');
    }
  }
}
