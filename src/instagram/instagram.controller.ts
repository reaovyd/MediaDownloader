import { Body, Controller, Post } from '@nestjs/common';
import { InstagramImageDTO } from './instagram-image.dto';
import { InstagramVideoDTO } from './instagram-video.dto';

@Controller('instagram')
export class InstagramController {
  constructor() {}
  @Post('download/image')
  async downloadImage(@Body() imageDTO: InstagramImageDTO) {}
  @Post('download/video')
  async downloadVideo(@Body() videoDTO: InstagramVideoDTO) {}
}
