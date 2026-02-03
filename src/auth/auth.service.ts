import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

/**
 * Service for handling authentication.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Logs in a user by verifying their credentials and generating a JWT token.
   *
   * @param username The username of the user.
   * @param password The password of the user.
   * @returns A promise that resolves to an object containing the access token.
   */
  async login(username: string, password: string) {
    const user = await this.userRepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: this.jwtService.sign({ sub: user.id, username: user.username }),
    };
  }

  /**
   * Verifies the provided JWT token and returns the user associated with it.
   *
   * @param token The JWT token to verify.
   * @returns A promise that resolves to the user associated with the token.
   */
  async verifyToken(token: string) {
    try {
      const decoded = this.jwtService.verify<{ sub: number; username: string }>(token);
      return await this.userRepository.findOne({ id: decoded.sub });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
