import { Inject, CACHE_MANAGER, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { TwitterApi } from 'twitter-api-v2';
import axios from 'axios';

@Injectable()
export class TwitterService {
  private client: TwitterApi;
  private pattern: RegExp;
  private status_pattern: RegExp;
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    this.client = new TwitterApi({
      appKey: configService.get<string>('TWITTER_API_KEY'),
      appSecret: configService.get<string>('TWITTER_API_KEY_SECRET'),
      accessToken: configService.get<string>('TWITTER_ACCESS_TOKEN'),
      accessSecret: configService.get<string>('TWITTER_ACCESS_TOKEN_SECRET'),
    });
    this.pattern = new RegExp(
      /^(((http|https):\/\/)?(www\.)?(mobile\.)?twitter\.com\/.+\/status\/\d+|((http|https):\/\/)?t\.co\/\w+)/,
    );
    this.status_pattern = new RegExp(/\/status\/\d+/);
  }
  async getTwitterLink(link: string): Promise<any> {
    if (link == undefined || link.length == 0) {
      throw new Error('Invalid link argument was passed');
    }
    const cacheHit = await this.cacheManager.get(link);
    if (cacheHit != null) {
      return cacheHit;
    }
    const matchedValues = link.match(this.pattern);
    const isValidMatch: boolean = matchedValues != null;
    let status: string;
    let mediaList;
    if (isValidMatch) {
      if (link.includes('t.co')) {
        try {
          const verifiedLink = (await axios.get(link)).request.res.responseUrl;
          const matchLink = verifiedLink.match(this.status_pattern);

          const statusArray = matchLink[0].split('/');
          status = statusArray[statusArray.length - 1];
        } catch (err) {
          throw new Error('Invalid link: was not searchable');
        }
      } else {
        const statusArray = matchedValues[0].split('/');
        status = statusArray[statusArray.length - 1];
      }
      try {
        // TODO getting a TLSSocket error here weirdfly
        const getSingleTweet = await this.client.v1.singleTweet(status);

        mediaList = getSingleTweet.extended_entities.media
          .filter((elem) => {
            return elem.type == 'video';
          })
          .map((elem) => {
            return elem.video_info.variants.reduce(
              (acc: any, item: any) => {
                if (item.bitrate > acc.bitrate) {
                  return item;
                } else {
                  return acc;
                }
              },
              { bitrate: -1 },
            );
          });
      } catch (err) {
        if (err.message.match(/Rate limit exceeded/)) {
          // can set up an OAuth2 for users that have an account
          throw new Error(
            'Twitter service is currently busy; this account is currently being rate limited',
          );
        }
        throw new Error('Invalid link: invalid status was given');
      }
    } else {
      throw new Error('Invalid link: did not match valid pattern');
    }
    if (mediaList == undefined || mediaList.length == 0) {
      throw new Error('No video was inside this link');
    }

    const ret = await Promise.resolve({
      link: mediaList,
    });
    await this.cacheManager.set(link, ret, { ttl: 5 * 60 });
    return ret;
  }
}
