import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res
        .cookie('accessToken', `${'Bearer '}${token}`, {
          httpOnly: true,
        })
        .json({ message: 'Logged in successfully' });
    })
    .catch(next);
};

export default login;
