import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { jwtConfig } from './jwt.config';

@Module({
  imports: [
    JwtModule.register(jwtConfig)
  ],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}