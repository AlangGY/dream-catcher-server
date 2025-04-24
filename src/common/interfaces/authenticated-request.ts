import { Request } from 'express';
import { User } from 'src/auth/entities/user.entity';

export interface AuthenticatedRequest extends Request {
  user: User;
}
