import { Test } from '@nestjs/testing';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/users/auth.service';
import { User } from 'src/users/user.entity';

describe('Auth Service', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
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
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'email@email.com', password: 'passwd' } as User,
      ]);
    await expect(service.signup('email@email.com', 'passwd')).rejects.toThrow();
  });

  it('Should throw an error if user sign in with an unused email', async () => {
    await expect(service.signin('email@email.com', 'passwd')).rejects.toThrow();
  });

  it('Should throw an error if an sign in with an invalid password', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { email: 'teste@email.com', password: 'passwd', id: 1 } as User,
      ]);
    await expect(service.signin('email@email.com', 'pass')).rejects.toThrow();
  });
});
