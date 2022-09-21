import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly avatar?: string;

  @IsOptional()
  @IsString()
  readonly bio?: string;
}
