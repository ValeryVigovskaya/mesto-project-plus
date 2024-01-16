import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import NotFoundError from '../errors/not-found-err';
import BadRequestError from '../errors/bad-request-err';
import ConflictError from '../errors/conflict-err';
import { CREATED } from '../constants/constants';
import bcrypt from 'bcrypt';


export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  return User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

export const getUserMe = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  return User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  // записываем данные в базу
  return bcrypt.hash(password, 10)
      .then(hash => User.create({
        email: email,
        password: hash,
      }))
      .then((user) => {
        const { _id, email, name, about, avatar } = user;
        res.status(CREATED).send({
          _id,
          email,
          name,
          about,
          avatar
        });
      })
      // если данные не записались, вернём ошибку
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Введены некорректные данные'));
        } else if (err.code === 11000){
          next(new ConflictError('Пользователь с такой почтой уже существует'))
        } else {
          next(err);
        }
      })
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  return User.findByIdAndUpdate(_id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  return User.findByIdAndUpdate(_id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};