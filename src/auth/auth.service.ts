import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    // Simplified login logic for demonstration
    if (!username || !password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // In a real app, you'd validate against a user repository
    const payload = { username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}