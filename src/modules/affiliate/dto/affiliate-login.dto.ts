import { IsEmail, IsNotEmpty } from 'class-validator'

export class AffiliateLoginDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string
}
