import { Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { AuthenticatedUserGuard } from './authenticated-user.guard';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { User } from '../models/user.entity';
import { Request } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';

describe('AuthenticatedUserGuard', () => {
  let guard: AuthenticatedUserGuard;
  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthenticatedUserGuard],
    })
      .useMocker(createMock)
      .compile();

    guard = module.get(AuthenticatedUserGuard);
    authService = module.get(AuthService);

    jest.spyOn(GqlExecutionContext, 'create').mockImplementation(() => {
      return {
        getContext: () => ({
          req: {
            headers: {
              authorization: 'Bearer token',
            },
          } as Request,
        }),
      } as unknown as GqlExecutionContext;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#canActivate', () => {
    it('returns true if the user is authenticated', async () => {
      // Arrange
      const mockContext = {} as ExecutionContext;
      jest.spyOn(authService, 'verifyToken').mockResolvedValue(
        new User({
          id: 1,
          username: 'testuser',
          hashedPassword: '$2b$10$eImiZ2xvY2F0aW9uwc3Rlc3Q=',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );

      // Act
      const result = await guard.canActivate(mockContext);

      // Assert
      expect(result).toBe(true);
      expect(authService.verifyToken).toHaveBeenCalledWith('token');
      expect(GqlExecutionContext.create).toHaveBeenCalledWith(mockContext);
    });

    it('throws UnauthorizedException if the token is invalid', async () => {
      // Arrange
      const mockContext = {} as ExecutionContext;
      jest.spyOn(authService, 'verifyToken').mockResolvedValue(null);

      // Act
      const promise = guard.canActivate(mockContext);

      // Assert
      await expect(promise).rejects.toThrow(UnauthorizedException);
      await expect(promise).rejects.toThrow('Invalid token');
      expect(authService.verifyToken).toHaveBeenCalledWith('token');
      expect(GqlExecutionContext.create).toHaveBeenCalledWith(mockContext);
    });

    it('throws UnauthorizedException if no token is provided', async () => {
      // Arrange
      const mockContext = {} as ExecutionContext;
      jest.spyOn(GqlExecutionContext, 'create').mockImplementation(() => {
        return {
          getContext: () => ({
            req: {
              headers: {}, // No authorization header
            } as Request,
          }),
        } as unknown as GqlExecutionContext;
      });

      // Act
      const promise = guard.canActivate(mockContext);

      // Assert
      await expect(promise).rejects.toThrow('No token provided, or invalid token format.');
      await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
      expect(authService.verifyToken).not.toHaveBeenCalled();
      expect(GqlExecutionContext.create).toHaveBeenCalledWith(mockContext);
    });

    it('throws an UnauthorizedException if the token not prefixed with Bearer', async () => {
      // Arrange
      const mockContext = {} as ExecutionContext;
      jest.spyOn(GqlExecutionContext, 'create').mockImplementation(() => {
        return {
          getContext: () => ({
            req: {
              headers: {
                authorization: 'token', // No Bearer prefix
              },
            } as Request,
          }),
        } as unknown as GqlExecutionContext;
      });

      // Act
      const promise = guard.canActivate(mockContext);

      // Assert
      await expect(promise).rejects.toThrow(UnauthorizedException);
      await expect(promise).rejects.toThrow('No token provided, or invalid token format.');
      expect(authService.verifyToken).not.toHaveBeenCalled();
      expect(GqlExecutionContext.create).toHaveBeenCalledWith(mockContext);
    });
  });
});
