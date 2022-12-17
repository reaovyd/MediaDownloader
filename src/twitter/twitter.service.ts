import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TwitterApi } from 'twitter-api-v2'
import axios from 'axios'
//const RE2 = require("re2")


@Injectable()
export class TwitterService {
    private client : TwitterApi;
    private pattern : RegExp;
    private status_pattern : RegExp;
    constructor(private configService : ConfigService) {
        this.client = new TwitterApi({
            appKey: configService.get<string>("TWITTER_API_KEY"),
            appSecret: configService.get<string>("TWITTER_API_KEY_SECRET"),
            accessToken: configService.get<string>("TWITTER_ACCESS_TOKEN"),
            accessSecret : configService.get<string>("TWITTER_ACCESS_TOKEN_SECRET")
        })
        this.pattern = new RegExp(/^(((http|https):\/\/)?(www\.)?(mobile\.)?twitter\.com\/.+\/status\/\d+|((http|https):\/\/)?t\.co\/\w+)/)
        this.status_pattern = new RegExp(/\/status\/\d+/);
        //this.shortened_link_pattern = new RE2(/^((http|https):\/\/)?t\.co\/\w+/)
        //axios.get("https://t.co/pF2oDSIRo1").then(res => {
        //    console.log(res.request.res.responseUrl)
        //})
        // "https://t.co/0Rc7NiTZh1".match(this.shortened_link_pattern)
    }
    async getTwitterLink(link : string) : Promise<any> { 
        if(link == undefined || link.length == 0) {
            throw new Error("Invalid link argument was passed")
        }
        const matchedValues = link.match(this.pattern)
        let isValidMatch : boolean = matchedValues != null
        let status : string;
        let mediaList;
        if(isValidMatch) { 
            if(link.includes("t.co")) { 
                try { 
                     let verifiedLink = (await axios.get(link)).request.res.responseUrl
                     let matchLink = verifiedLink.match(this.status_pattern)

                     let statusArray = matchLink[0].split("/")
                     status = statusArray[statusArray.length - 1]
                } catch(err) {
                    throw new Error("Invalid link: was not searchable")
                }
            } else {
                let statusArray = matchedValues[0].split("/")
                status = statusArray[statusArray.length - 1]
            }
            try {
                const getSingleTweet = await this.client.v1.singleTweet(status)
                mediaList = getSingleTweet.extended_entities.media.filter(elem => {
                    return elem.type == 'video'
                }).map(elem => {
                    return elem.video_info.variants.reduce((acc : any, item: any) => {
                        if(item.bitrate > acc.bitrate) {
                            return item
                        } else {
                            return acc
                        }
                    }, {bitrate : -1})
                })
            } catch(err) {
                if(err.message == "No video was inside this link") {
                    throw new Error(`Invalid link: ${err.message}`)
                } else {
                    throw new Error("Invalid link: invalid status was given")
                }
            }

        } else {
            throw new Error("Invalid link: did not match valid pattern")
        }
        if(mediaList == undefined || mediaList.length == 0) {
            throw new Error("No video was inside this link")
        }

        return Promise.resolve({
            "link": mediaList
        })
    }
}