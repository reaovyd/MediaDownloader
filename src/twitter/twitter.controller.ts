import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { TwitterVideoDTO } from "./twitter-video.dto";
import { TwitterService } from "./twitter.service";

@Controller("twitter")
export class TwitterController {
    constructor(private twitterService : TwitterService) {}
    @Post("download")
    async installVideo(@Body() twitterVideoDto : TwitterVideoDTO ) : Promise<any> {
        if(twitterVideoDto.link == undefined || twitterVideoDto.link.length == 0) {
            throw new HttpException("Missing Twitter Link", HttpStatus.UNPROCESSABLE_ENTITY)
        }
        try { 
            const res = await this.twitterService.getTwitterLink(twitterVideoDto.link)
            return Promise.resolve(res)
        } catch(err) {
            throw new HttpException(err.message, HttpStatus.UNPROCESSABLE_ENTITY)
        }
    }
}