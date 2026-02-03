import { ObjectType } from '@nestjs/graphql';

/**
 * An object type for the authentication result.  Currently for simplicity of the exercise, it only
 * has an access token with a short expiration time, without a long-lived refresh token to exchange
 * for a new access token.
 */
@ObjectType()
export class AuthResult {
  /**
   * The access token in JWT format.
   */
  accessToken: string;
}
