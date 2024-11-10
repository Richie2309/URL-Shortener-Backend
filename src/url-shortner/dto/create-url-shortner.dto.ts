import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateUrlShortnerDto {
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  originalUrl:string
}
