export class RoleClass {
  role_id: number = 0;
  role: string = '';
}

export class UserClass {
  id: number = 0;
  email: string = '';
  password: string = '';
  username: string = '';
  roles: RoleClass[] = [];
}
