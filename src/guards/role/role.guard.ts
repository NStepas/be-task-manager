import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {AuthService} from "../../modules/todo-list/services/auth.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector,
                private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        const request = context.switchToHttp().getRequest();
        if(request.params.userId) {
            const user = await this.authService.getLoggedUser(request.params.userId);
            return roles.includes(user.first_name.toLowerCase())
        }
        return false;
    }
}
