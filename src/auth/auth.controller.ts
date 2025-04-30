import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from '../model/user/user.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @Post('login')
  @ApiOperation({ summary: 'Realizar login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  async login(@Body() body: { email: string; password: string }) {
    const token = await this.authService.login(body.email, body.password);
    return {
      message: 'Login realizado com sucesso!',
      access_token: token,
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        email: { type: 'string' },
        telefone: { type: 'string' },
      },
    },
  })
  async register(
    @Body()
    body: {
      username: string;
      password: string;
      email: string;
      telefone: string;
    },
  ) {
    const user = await this.userService.create(
      body.username,
      body.password,
      body.email,
      body.telefone,
    );
    return {
      message: 'Usuário criado com sucesso!',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        telefone: user.telefone,
      },
    };
  }
}
