import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/not-auth-err';

export default (req: Request, res: Response, next: NextFunction) => {
  const { access_token } = req.cookies;
  if (!access_token || !access_token.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  const token = access_token.replace('Bearer ', '');

  let payload
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload as {_id: string};// записываем пейлоуд в объект запроса

return next(); // пропускаем запрос дальше
};
