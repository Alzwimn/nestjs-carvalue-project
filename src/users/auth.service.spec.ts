import { Test } from '@nestjs/testing';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/users/auth.service';
import { User } from 'src/users/user.entity';

describe('Auth Service', () => {
  let service: AuthService;

  beforeEach(async () => {
    const fakeUsersService: Partial<UsersService> = {
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
    const user = await service.signup('test@test.com', 'password');
    const [ salt, hash ] = user.password.split('.');
    expect(user.password).not.toEqual(password);
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();

  });
});
