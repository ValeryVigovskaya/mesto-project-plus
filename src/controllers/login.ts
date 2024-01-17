import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/not-auth-err';

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
  .then((user) => {
    const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
    res
    .cookie("access_token", `${'Bearer '}${token}`, {
      httpOnly: true,
    })
    .json({ message: "Logged in successfully" });
  })
  .catch(next);
};

