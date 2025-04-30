import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../model/user/user.module';
import { JwtStrategy } from './jwt.strategy';
import * as fs from 'fs';
import * as path from 'path';

@Module({
  imports: [
    JwtModule.register({
      // eslint-disable-next-line prettier/prettier
      privateKey: fs.readFileSync(path.join(process.cwd(), 'keys', 'private.pem')),
      // eslint-disable-next-line prettier/prettier
      publicKey: fs.readFileSync(path.join(process.cwd(), 'keys', 'public.pem')),
      signOptions: {
        algorithm: 'RS256',
        expiresIn: '1h',
      },
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
