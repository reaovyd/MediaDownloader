import { Injectable } from '@nestjs/common';
const youtubeDl = require("youtube-dl-exec")

@Injectable()
export class YoutubeService {
    async getYoutubeLink(link : string) : Promise<string> {
        if(link == undefined || link.length == 0) {
            throw new Error("Invalid link argument was passed") 
        }
        // doesn't scale on 
        // combining audio and mp4 implicitly could be a cpu bottleneck
        // TODO can store in a redis/memory cache 
        try {
            const res = await youtubeDl(link, {
                skipDownload: true,
                format: "mp4",
                getUrl : true
            })
            return Promise.resolve(res) 
        } catch(err) {
            return Promise.reject("Invalid link: was not searchable")
        }
    }
}
