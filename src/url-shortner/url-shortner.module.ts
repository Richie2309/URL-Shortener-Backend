import { Module } from '@nestjs/common';
import { UrlShortnerService } from './url-shortner.service';
import { UrlShortnerController } from './url-shortner.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './schema/url-shortner.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
    JwtModule.register({
      secret:process.env.JWT_SECRET,
      signOptions:{expiresIn:'24h'}
    })
  ],
  controllers: [UrlShortnerController],
  providers: [UrlShortnerService],
})
export class UrlShortnerModule { }
