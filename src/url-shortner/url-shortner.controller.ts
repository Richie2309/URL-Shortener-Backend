import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Redirect, NotFoundException } from '@nestjs/common';
import { UrlShortnerService } from './url-shortner.service';
import { CreateUrlShortnerDto } from './dto/create-url-shortner.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('url-shortner')
export class UrlShortnerController {
  constructor(private readonly urlShortnerService: UrlShortnerService) { }

  @UseGuards(AuthGuard)
  @Post('shorten')
  async createShortUrl(@Body() createUrlDto: CreateUrlShortnerDto) {
    const url = await this.urlShortnerService.createShortUrl(createUrlDto)
    return {
      shortUrl: `${process.env.BASE_URL}/url-shortner/${url.shortUrl}`,
    }
  }

  // @UseGuards(AuthGuard)
  @Get(':shortUrl')
  @Redirect()
  async redirectToOriginalUrl(@Param('shortUrl') shortUrl: string) {
    try {
      const url = await this.urlShortnerService.getOriginalUrl(shortUrl);
      if (!url) {
        throw new NotFoundException('Short URL not found');
      }
      return { url: url.originalUrl };
    } catch (error) {
      throw new NotFoundException('Error fetching URL');
    }
  }
}
