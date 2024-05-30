import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

@Schema({ versionKey: false })
export class User extends AbstractDocument {
  @Prop()
  email: string;

  @Prop()
  password: string;

  // @Prop({ type: [String], default: [] })
  // roles: string[];

  // @Prop({ type: [{ type: Schema.Types.ObjectId, ref: 'Order' }] })
  // orders: Order[];

}

export const UserSchema = SchemaFactory.createForClass(User);
