import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import NotFoundError from '../errors/not-found-err';
import BadRequestError from '../errors/bad-request-err';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    // .populate('user')
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  // записываем данные в базу
  return (
    // eslint-disable-next-line no-underscore-dangle
    Card.create({ name, link, owner: req.user._id })
      // возвращаем записанные в базу данные пользователю
      .then((card) => res.send({ data: card }))
      // если данные не записались, вернём ошибку
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Введены некорректные данные'));
        } else {
          next();
        }
      })
  );
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch(next);
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // eslint-disable-next-line no-underscore-dangle
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next();
      }
    });
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // eslint-disable-next-line no-underscore-dangle
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next();
      }
    });
};
