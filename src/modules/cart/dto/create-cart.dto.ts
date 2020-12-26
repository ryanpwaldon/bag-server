import { IsMongoId, IsNotEmpty } from 'class-validator'
import { Types } from 'mongoose'

export class CreateCartDto {
  @IsNotEmpty()
  @IsMongoId()
  user!: Types.ObjectId
}
