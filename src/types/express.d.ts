import type { User } from '../auth/models/user.entity';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
