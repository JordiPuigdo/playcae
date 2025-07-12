import { UserRole } from './document';

export interface User {
  id: string;
  userRole: UserRole;
  token: string;
}
