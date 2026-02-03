import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { AuthService } from '../auth.service';

/**
 * Guard to protect routes that require authentication. This guard merely checks if the user has
 * provided the correct token. It does not check for roles or permissions.
 *
 * @see {@link https://docs.nestjs.com/guards}
 */
@Injectable()
export class AuthenticatedUserGuard implements CanActivate {
  private readonly logger = new Logger(AuthenticatedUserGuard.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * Checks if the user is authenticated by verifying the token provided in the request headers.
   *
   * @param context The execution context of the request.
   * @returns A promise that resolves to true if the user is authenticated, otherwise throws an
   *          {@link UnauthorizedException} to allow us to control the error message.
   */
  async canActivate(context: ExecutionContext) {
    const graphqlContext = GqlExecutionContext.create(context);
    const { req: request } = graphqlContext.getContext<{ req: Request }>();
    this.logger.debug(`Checking authentication for request: ${JSON.stringify(request.headers)}`);
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided, or invalid token format.');
    }

    const user = await this.authService.verifyToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = user;
    return true;
  }

  /**
   * Extracts the token from the request headers.
   *
   * @param request The request object.
   * @returns The extracted token or undefined if either:
   *          - no token is provided
   *          - the token is not in the correct format (i.e., does not start with 'Bearer ')
   */
  private extractTokenFromHeader(request: Request) {
    this.logger.debug(`xtracting headers from request: ${JSON.stringify(request.headers)}`);
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return undefined;
    }

    const [prefix, token] = authHeader.split(' ');
    return prefix === 'Bearer' ? token : undefined;
  }
}
