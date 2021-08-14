import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from 'src/users/user.entity';
import { AuthService } from 'src/users/auth.service';
import { CurrentUserInterceptor } from 'src/users/interceptors/current-user.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthService, {
    provide: APP_INTERCEPTOR,
    useClass: CurrentUserInterceptor
  }],
})
export class UsersModule {}
