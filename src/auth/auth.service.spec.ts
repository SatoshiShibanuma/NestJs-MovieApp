import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let mockJwtService: {
    sign: (payload: any) => string;
    verify: (token: string) => any;
  };

  beforeEach(async () => {
    // Mock JwtService
    mockJwtService = {
      sign: (payload: any) => 'mocked_token',
      verify: (token: string) => ({ username: 'testuser' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token for valid credentials', async () => {
      const result = await authService.login('testuser', 'password');
      expect(result).toHaveProperty('access_token', 'mocked_token');
    });

    it('should throw UnauthorizedException for empty credentials', async () => {
      await expect(authService.login('', '')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const verifiedToken = authService.verifyToken('valid_token');
      expect(verifiedToken).toEqual({ username: 'testuser' });
    });

    it('should throw UnauthorizedException for invalid token', () => {
      mockJwtService.verify = () => { throw new Error('Invalid token'); };
      expect(() => authService.verifyToken('invalid_token')).toThrow(UnauthorizedException);
    });
  });
});