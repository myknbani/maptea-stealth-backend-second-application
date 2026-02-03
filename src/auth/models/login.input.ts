import { InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * An input type for login.
 */
@InputType()
export class LoginInput {
  /**
   * The username of the user.
   */
  @IsString()
  @IsNotEmpty()
  username: string;

  /**
   * The password of the user.
   */
  @IsString()
  @IsNotEmpty()
  password: string;
}
