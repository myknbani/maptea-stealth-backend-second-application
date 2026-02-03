import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from './models/user.entity';
import { createMock } from '@golevelup/ts-jest';

import bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';

jest.mock(
  'bcryptjs',
  () =>
    ({
      ...jest.requireActual('bcryptjs'),
      compare: jest.fn(),
      hash: jest.fn().mockResolvedValue('$2b$10$Psdx5Q1Z2Y8e4a0c3b6e7uO'),
    }) as typeof bcrypt,
);

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker(createMock)
      .compile();

    authService = module.get(AuthService);
    userRepository = module.get(UserRepository);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#login', () => {
    it('returns a JWT token when credentials are valid', async () => {
      // Arrange
      const username = 'testuser';
      const password = 'password123';
      const user = new User({
        id: 1,
        username,
        hashedPassword: '$2b$10$Psdx5Q1Z2Y8e4a0c3b6e7uO',
      });

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);
      jest
        .spyOn(jwtService, 'sign')
        .mockReturnValue(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiO' +
            'jE2MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        );

      // Act
      const result = await authService.login(username, password);

      // Assert
      expect(result).toEqual({
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInV' +
          'zZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE2MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({ username });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.hashedPassword);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        username: user.username,
      });
    });

    it('throws an error when the username is invalid', async () => {
      // Arrange
      const username = 'invaliduser';
      const password = 'password123';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      // Act
      const promise = authService.login(username, password);

      // Assert
      await expect(promise).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ username });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('throws an error when the password is invalid', async () => {
      // Arrange
      const username = 'testuser';
      const password = 'wrongpassword';
      const user = new User({
        id: 1,
        username,
        hashedPassword: '$2b$10$Psdx5Q1Z2Y8e4a0c3b6e7uO',
      });

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(false);

      // Act
      const promise = authService.login(username, password);

      // Assert
      await expect(promise).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ username });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.hashedPassword);
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });
});
