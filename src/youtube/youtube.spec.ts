import { HttpException, HttpStatus } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { YoutubeController } from "./youtube.controller"; 
import { YoutubeService } from "./youtube.service";

describe("YoutubeController", () => {
    let youtubeController : YoutubeController
    let youtubeService : YoutubeService
    beforeEach(async() => {
        const youtubeModule = await Test.createTestingModule({
            controllers: [YoutubeController],
            providers: [YoutubeService]
        }).compile()
        youtubeController = youtubeModule.get<YoutubeController>(YoutubeController)
        youtubeService = youtubeModule.get<YoutubeService>(YoutubeService)
    });

    describe("installVideo ", () => {
        it("should throw an HttpException", async() => {
            try {
                await youtubeController.installVideo({"link" : ""})
            } catch(err) {
                await expect(err).toEqual(new HttpException('Missing Link Parameter', HttpStatus.UNPROCESSABLE_ENTITY))
            }
        })
    })
    describe("getYoutubeLink", () => {
        it("should throw an Error displaying that it was an invalid link from an empty string", async() => {
            try {
                await youtubeService.getYoutubeLink("")
            } catch(err) {
                await expect(err).toEqual(new Error('Invalid link argument was passed'))
            }
        })
        it("should throw an Error displaying that it was an invalid link from an undefined link", async() => {
            try {
                await youtubeService.getYoutubeLink(undefined)
            } catch(err) {
                await expect(err).toEqual(new Error('Invalid link argument was passed'))
            }
        })
        it("should reject since the link was not a searchable one/ a 404 link", async() => {
            try {
                await youtubeService.getYoutubeLink("AAA")
            } catch(err) {
                await expect(err).toEqual("Invalid link: was not searchable")
            }
        })
        it("should return an accurate link", async() => {
            const obj = await youtubeService.getYoutubeLink("https://www.youtube.com/watch?v=e-ORhEE9VVg")
            expect(obj.link).not.toEqual(undefined)
        }, 10000)
    })


})
