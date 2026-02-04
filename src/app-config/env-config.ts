import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

type TypesafeTimeString = NonNullable<JwtModuleOptions['signOptions']>['expiresIn'];

/**
 * Configuration that's controlled or overridable via environment variables.
 */
@Injectable()
export class EnvConfig {
  constructor(private readonly configService: ConfigService<Record<string, any>, true>) {}

  get port(): number {
    return this.configService.get('PORT', { infer: true }) ?? 3001;
  }

  get databaseUrl(): string {
    return this.configService.get('DATABASE_URL', { infer: true });
  }
  get jwtSecret(): string {
    return this.configService.get('JWT_SECRET', { infer: true });
  }

  // non-environment-specific (a.k.a. app) config
  get jwtExpiration(): TypesafeTimeString {
    return this.configService.get('JWT_EXPIRATION', { infer: true }) ?? '1h';
  }
}
