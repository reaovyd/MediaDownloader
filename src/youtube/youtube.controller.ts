import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { YoutubeVideoDTO } from './youtube-video.dto';
import { YoutubeService } from './youtube.service';

@Controller('youtube')
export class YoutubeController {
  constructor(private youtubeService : YoutubeService) {}
  @Post('download')
  async installVideo(@Body() videoBodyRequest: YoutubeVideoDTO) {
    const link = videoBodyRequest.link;
    if (link == undefined || link.length == 0) {
      throw new HttpException(
        'Missing Link Parameter',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    try {
      const ret = await this.youtubeService.getYoutubeLink(link)
      return {
        "link" : ret
      }
    }catch(err) {
      throw new HttpException(
        err,
        HttpStatus.UNPROCESSABLE_ENTITY
      )
    }
  }
}
