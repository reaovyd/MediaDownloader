import axios from "axios";
import { Cookie } from 'tough-cookie'
const FileCookieStore = require("tough-cookie-filestore2")
const cookieStore = new FileCookieStore("./cookie-storage/cookies.json")

export class InstagramAPI {
    constructor(username : string, password : string) {
    }
    async getMediaFromID(id : string) {

    }
}