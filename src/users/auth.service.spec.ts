import { Test } from '@nestjs/testing';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/users/auth.service';
import { User } from 'src/users/user.entity';
import { randomBytes, scrypt as _scrypt } from 'crypto';

describe('Auth Service', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('Should create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('Should create a new user with salted and hashed password', async () => {
    const email = 'test@test.com';
    const password = 'password';
    const user = await service.signup(email, password);
    const [salt, hash] = user.password.split('.');
    expect(user.password).not.toEqual(password);
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('Should throw an error if user sign up with an email already in use', async () => {
    await service.signup('email@email.com', 'password');
    await expect(service.signup('email@email.com', 'passwd')).rejects.toThrow();
  });

  it('Should throw an error if user sign in with an unused email', async () => {
    await expect(service.signin('email@email.com', 'passwd')).rejects.toThrow();
  });

  it('Should throw an error if an sign in with an invalid password', async () => {
    await service.signup('email@email.com', 'secretePasswd')
    await expect(service.signin('email@email.com', 'invalidpassword')).rejects.toThrow();
  });

  it('Should return a user if correct password is provided', async () => {
    await service.signup('teste@email.com', 'passwd');
    const user = await service.signin('teste@email.com', 'passwd');
    expect(user).toBeDefined();
  });
});
