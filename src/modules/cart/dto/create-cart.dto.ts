import { IsMongoId, IsNotEmpty } from 'class-validator'
import { Schema } from 'mongoose'

export class CreateCartDto {
  @IsNotEmpty()
  @IsMongoId()
  user!: Schema.Types.ObjectId
}
