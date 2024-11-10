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
    return url
  }
}
 