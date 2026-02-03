import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthResult } from './models/auth-result.model';
import { AuthService } from './auth.service';
import { LoginInput } from './models/login.input';

/**
 * The resolver for authentication-related operations. For now, this resolver handles the only the
 * login operation.
 */
@Resolver(() => AuthResult)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResult, {
    description:
      'Login a user and return an access token.  For simplicity, this example does not ' +
      ' use a refresh token.',
  })
  async login(@Args('loginInput') loginInput: LoginInput): Promise<AuthResult> {
    const { username, password } = loginInput;
    return await this.authService.login(username, password);
  }
}
