import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [
        {
          provide: JwtService,
          useValue: {
            signAsync: async () => 'mocked_token',
            verifyAsync: async () => ({ username: 'testuser' }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token for valid credentials', async () => {
      const signSpy = vi.spyOn(jwtService, 'signAsync');
      const result = await authService.login('testuser', 'password');
      
      expect(result).toHaveProperty('access_token', 'mocked_token');
      expect(signSpy).toHaveBeenCalledWith({ username: 'testuser' });
    });

    it('should throw UnauthorizedException for empty credentials', async () => {
      await expect(authService.login('', '')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', async () => {
      const verifySpy = vi.spyOn(jwtService, 'verifyAsync');
      const result = await authService.verifyToken('valid_token');
      
      expect(result).toEqual({ username: 'testuser' });
      expect(verifySpy).toHaveBeenCalledWith('valid_token');
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      vi.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error('Invalid token'));
      
      await expect(authService.verifyToken('invalid_token')).rejects.toThrow(UnauthorizedException);
    });
  });
});