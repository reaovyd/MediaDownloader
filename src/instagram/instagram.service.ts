import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InstagramAPI } from './instagram-api';
const FileCookieStore = require('tough-cookie-filestore2');
const cookieStore = new FileCookieStore('./cookie-storage/cookies.json');

@Injectable()
export class InstagramService {
  private client;
  private instagramAPI : InstagramAPI;
  constructor(private configService: ConfigService) {
    const { username, password } = {
      username: configService.get('INSTAGRAM_USERNAME'),
      password: configService.get('INSTAGRAM_PASSWORD'),
    };
    this.instagramAPI = new InstagramAPI(username, password)

    //this.client = new Instagram({ username, password, cookieStore })
    //this.client.login().then(res => {
    //    console.log(res)
    //}).catch(err => {
    //    console.error(err)
    //})
  }
}
