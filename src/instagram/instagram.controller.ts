import { Body, Controller, Inject, Post } from '@nestjs/common';
import { InstagramImageDTO } from './instagram-image.dto';
import { InstagramVideoDTO } from './instagram-video.dto';
import { InstagramService } from './instagram.service';

@Controller('instagram')
export class InstagramController {
  constructor(private instagramService : InstagramService) {}
  @Post('download/image')
  async downloadImage(@Body() imageDTO: InstagramImageDTO) {}
  @Post('download/video')
  async downloadVideo(@Body() videoDTO: InstagramVideoDTO) {}
}
