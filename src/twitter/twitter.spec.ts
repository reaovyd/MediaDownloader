import { HttpException, HttpStatus } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { TwitterController } from "./twitter.controller";
import { TwitterService } from "./twitter.service";

describe("Twitter basic tests", () => {
    let twitterController : TwitterController;
    let twitterService : TwitterService; 
    beforeEach(async() => {
        const twitterModule = await Test.createTestingModule({
            imports : [ConfigModule.forRoot({isGlobal : true})],
            controllers: [TwitterController],
            providers: [TwitterService]
        }).compile()
        twitterController = await twitterModule.get<TwitterController>(TwitterController)
        twitterService = await twitterModule.get<TwitterService>(TwitterService)
    })
    it("should throw an HttpException error", async () => {
        try {
            await twitterController.installVideo({"link" : ""})
        } catch(err) {
            expect(err.name).toEqual("HttpException")
        }
    })
    it("should throw an error a link not given", async () => {
        try {
            await twitterService.getTwitterLink("")
        } catch(err) {
            expect(err.name).toEqual("Error")
        }
    })
    it("should throw an error since link is undefined", async () => {
        try {
            await twitterService.getTwitterLink(undefined)
        } catch(err) {
            expect(err.name).toEqual("Error")
        }
    })
    it("should throw an error since link failed regex matching", async () => {
        try {
            await twitterService.getTwitterLink("https://twitter.co/user/test/status/21312312312")
        } catch(err) {
            expect(err.message).toEqual("Invalid link: did not match valid pattern")
        }
    })
    it("should throw an error since link was not searchable", async () => {
        try {
            await twitterService.getTwitterLink("AAAA")
        } catch(err) {
            expect(err.message).toEqual("Invalid link: did not match valid pattern")
        }
    })
    it("should give the actual link since a valid link was given and was searchable", async () => {
        const res = await twitterService.getTwitterLink("https://twitter.com/EuTwistedF8/status/1603430407483150342")
        expect(res.link).not.toEqual(undefined)
    })
    it("should give the actual MOBILE link since a valid link was given and was searchable", async () => {
        const res = await twitterService.getTwitterLink("https://mobile.twitter.com/EuTwistedF8/status/1603430407483150342")
        expect(res.link).not.toEqual(undefined)
    })
    it("should give the actual WWW link since a valid link was given and was searchable", async () => {
        const res = await twitterService.getTwitterLink("https://www.twitter.com/EuTwistedF8/status/1603430407483150342")
        expect(res.link).not.toEqual(undefined)
    })
    it("should return error since the link was not searchable but matched regex", async () => {
        try {
            await twitterService.getTwitterLink("https://twitter.com/EuTwisted8/status/1603430407483150342")
        } catch(err) {
            expect(err.message).toEqual("Invalid link: link does not exist")
        }
    })
    it("should give a link even with twitter's url shortened", async () => {
        const res = await twitterService.getTwitterLink("https://t.co/igW5HpChji")
        expect(res.link).not.toEqual(undefined)
    })
    it("should not give a link even with twitter's url shortened since it is a 404 link", async () => {
        try {
           await twitterService.getTwitterLink("https://t.co/iW5HpChji")
        } catch(err) {
            expect(err.message).toEqual("Invalid link: was not searchable")
        }
    })
    it("should give the actual link from controller side", async () => {
        const res = await twitterController.installVideo({"link" : "https://twitter.com/BeratStuff/status/1603783996944617472"})
        expect(res.link).not.toEqual(undefined)
    })
})