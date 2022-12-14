import { Body, Controller, Post } from "@nestjs/common";
import { TwitterVideoDTO } from "./twitter-video.dto";
import { TwitterService } from "./twitter.service";

@Controller("twitter")
export class TwitterController {
    constructor(private twitterService : TwitterService) {}
    @Post("download")
    async installVideo(@Body() twitterVideoDto : TwitterVideoDTO ) : Promise<string> {

    }
}