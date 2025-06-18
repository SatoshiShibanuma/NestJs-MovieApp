import { Injectable } from '@nestjs/common';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  validateUser(user: Partial<User>): boolean {
    // Validate username
    if (!user.username || user.username.length < 3) {
      return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user.email || !emailRegex.test(user.email)) {
      return false;
    }

    // Validate password
    if (!user.password || user.password.length < 8) {
      return false;
    }

    return true;
  }
}