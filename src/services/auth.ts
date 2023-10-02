import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HttpError } from '../types/error.js';
import { TokenPayload } from '../types/token.js';

export class Auth {
  private static secret = process.env.TOKEN_SECRET!;

  static hash(passwd: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(passwd, saltRounds);
  }

  static compare(passwd: string, hash: string): Promise<boolean> {
    return bcrypt.compare(passwd, hash);
  }

  static signJWT(payload: TokenPayload): string {
    const token = jwt.sign(payload, Auth.secret);
    return token;
  }

  static verifyJWTGettingPayload(token: string): TokenPayload {
    try {
      const result = jwt.verify(token, Auth.secret);
      if (typeof result === 'string') {
        throw new Error();
      }

      return result as TokenPayload;
    } catch (error) {
      throw new HttpError(498, 'Invalid token', (error as Error).message);
    }
  }
}
