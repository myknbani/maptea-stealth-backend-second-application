import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

describe('AuthResolver', () => {
  let authResolver: AuthResolver;
  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthResolver],
    })
      .useMocker(createMock)
      .compile();

    authResolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  describe('#login', () => {
    it('logs-in a user and returns an access token', async () => {
      // Arrange
      const loginInput = {
        username: 'testuser',
        password: 'password123',
      };
      const mockAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoidGVzdHVzZX' +
        'IiLCJpYXQiOjE2MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      jest.spyOn(authService, 'login').mockResolvedValue({ accessToken: mockAccessToken });

      // Act
      const result = await authResolver.login(loginInput);

      // Assert
      expect(result).toEqual({ accessToken: mockAccessToken });
    });
  });
});
