export interface User {
    id: number;
    password: string
    username : string
    role: 'ADMIN' | 'USER';
  }