import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: 'your-secret-key', // In production, use a more secure method
  signOptions: { expiresIn: '1h' },
};