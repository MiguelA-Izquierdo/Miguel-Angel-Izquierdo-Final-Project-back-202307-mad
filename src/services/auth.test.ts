import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types/token';
import { Auth } from './auth';

describe('Given Auth static class', () => {
  describe('When we use bcrypt methods', () => {
    bcrypt.hash = jest.fn().mockResolvedValue('hash');
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    test('Then its hash method should be used', async () => {
      const result = await Auth.hash('');
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result).toBe('hash');
    });
    test('Then its compare method should be used', async () => {
      const result = await Auth.compare('', '');
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('When we use jwt methods', () => {
    jwt.sign = jest.fn().mockReturnValue('token');

    test('Then its signJWT method should be used', () => {
      const result = Auth.signJWT({} as TokenPayload);
      expect(jwt.sign).toHaveBeenCalled();
      expect(result).toBe('token');
    });

    test('Then its signJWT method should be used without errors', () => {
      jwt.verify = jest.fn().mockReturnValue({});
      const result = Auth.verifyJWTGettingPayload('');
      expect(jwt.verify).toHaveBeenCalled();
      expect(result).toEqual({});
    });

    test('Then its signJWT method should be used WITH errors', () => {
      jwt.verify = jest.fn().mockReturnValue('no payload');
      expect(() => Auth.verifyJWTGettingPayload('')).toThrow();
    });
  });
});
