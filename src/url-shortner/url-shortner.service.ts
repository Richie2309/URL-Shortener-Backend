import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUrlShortnerDto } from './dto/create-url-shortner.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Url, UrlDocument } from './schema/url-shortner.schema';
import { Model } from 'mongoose';
import * as shortid from 'shortid';

@Injectable()
export class UrlShortnerService {
  constructor(
    @InjectModel(Url.name) private urlModel: Model<UrlDocument>,
  ) { }

  async createShortUrl(createUrlDto: CreateUrlShortnerDto): Promise<UrlDocument> {
    const { originalUrl } = createUrlDto

    const existingUrl = await this.urlModel.findOne({ originalUrl })

    if (existingUrl) {
      return existingUrl
    }

    const shortUrl = shortid.generate()
    console.log('shorrr',shortUrl);
    

    try {
      const newUrl = await this.urlModel.create({
        originalUrl,
        shortUrl,
      })
      return newUrl
    } catch (error) {
      throw new BadRequestException('Error creating short URL')
    }
  }

  async getOriginalUrl(shortUrl: string): Promise<UrlDocument> {
    const url = await this.urlModel.findOne({ shortUrl })
    if (!url) {
      throw new NotFoundException('Short URL not found')
    }
    await url.save()
    return url
  }

  // async getUserUrls(userId:string):Promise<UrlDocument[]>{
  //   return this.urlModel.find({userId:new Types.ObjectId(userId)}).sort({createdAt:-1})
  // }

  // async deleteUrl(urlId:string, userId:string):Promise<void>{
  //   const url=await this.urlModel.findOneAndDelete({
  //     _id:new Types.ObjectId(userId),
  //     userId:new Types.ObjectId(userId),
  //   })

  //   if(!url){
  //     throw new NotFoundException('Url not found or unauthorized')
  //   }
  // }
}
