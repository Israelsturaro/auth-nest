/* eslint-disable prettier/prettier */
// src/auth/roles.guard.ts

import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { Request } from 'express';      
  import { ROLES_KEY } from './roles.decorator';
  import { UserRole } from '../enum/role'; 
  
  interface RequestWithUser extends Request {
    user: { role: UserRole };            
  }
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (!requiredRoles) return true;
  
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;
  
      if (!user || !requiredRoles.includes(user.role)) {
        throw new ForbiddenException('Permissão negada');
      }
      return true;
    }
  }
  