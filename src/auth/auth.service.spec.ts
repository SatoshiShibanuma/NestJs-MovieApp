import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: vi.fn().mockReturnValue('mocked_token'),
            verify: vi.fn().mockReturnValue({ username: 'testuser' }),
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
      const signSpy = vi.spyOn(jwtService, 'sign');
      const result = await authService.login('testuser', 'password');
      
      expect(result).toHaveProperty('access_token', 'mocked_token');
      expect(signSpy).toHaveBeenCalledWith({ username: 'testuser' });
    });

    it('should throw UnauthorizedException for empty credentials', async () => {
      await expect(authService.login('', '')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const verifySpy = vi.spyOn(jwtService, 'verify');
      const result = authService.verifyToken('valid_token');
      
      expect(result).toEqual({ username: 'testuser' });
      expect(verifySpy).toHaveBeenCalledWith('valid_token');
    });

    it('should throw UnauthorizedException for invalid token', () => {
      vi.spyOn(jwtService, 'verify').mockImplementation(() => { 
        throw new Error('Invalid token'); 
      });
      
      expect(() => authService.verifyToken('invalid_token')).toThrow(UnauthorizedException);
    });
  });
});