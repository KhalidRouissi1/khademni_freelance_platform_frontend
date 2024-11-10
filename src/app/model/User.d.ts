export interface User {
    id: number;
    email: string;
    role: 'CREATOR' | 'FREELANCER';
    name: string;
  }