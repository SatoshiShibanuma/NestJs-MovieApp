import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let mockJwtService: {
    signAsync: (payload: any) => Promise<string>;
    verifyAsync: (token: string) => Promise<any>;
  };

  beforeEach(async () => {
    mockJwtService = {
      signAsync: async () => 'mocked_token',
      verifyAsync: async () => ({ username: 'testuser' }),
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
    it('should verify a valid token', async () => {
      const result = await authService.verifyToken('valid_token');
      expect(result).toEqual({ username: 'testuser' });
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      mockJwtService.verifyAsync = async () => { 
        throw new Error('Invalid token'); 
      };
      
      await expect(authService.verifyToken('invalid_token')).rejects.toThrow(UnauthorizedException);
    });
  });
});