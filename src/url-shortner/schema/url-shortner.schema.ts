import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UrlDocument = Url & Document;

@Schema()
export class Url {
  @Prop({ required: true })
  originalUrl: string;

  @Prop({ required: true, unique: true })
  shortUrl: string;

  // @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  // userId: Types.ObjectId;

  // @Prop({ default: 0 })
  // clicks: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
