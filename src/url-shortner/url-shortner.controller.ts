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
      shortUrl: `${process.env.BASE_URL}/${url.shortUrl}`,
    }
  }

  @Get(':shortUrl')
  @Redirect()
  async redirectToOriginalUrl(@Param('shortUrl') shortUrl: string) {
    const url = await this.urlShortnerService.getOriginalUrl(shortUrl)
    return { url: url.originalUrl }
  }

  // @UseGuards(AuthGuard)
  // @Get('my/urls')
  // async getUserUrls(@Req() req: any) {
  //   const urls = await this.urlShortnerService.getUserUrls(req.user.id)
  //   return urls.map(url => ({
  //     id: url._id,
  //     originalUrl: url.originalUrl,
  //     shortUrl: `${process.env.BASE_URL}/${url.shortUrl}`,
  //     clicks: url.clicks,
  //     createdAt: url.createdAt,
  //   }))
  // }

  // @UseGuards(AuthGuard)
  // @Delete(':id')
  // async deleteUrl(@Param('id') id:string, @Req() req:any){
  //   await this.urlShortnerService.deleteUrl(id,req.user.id)
  //   return {message:"URL deleted successfully"}
  // }
}
