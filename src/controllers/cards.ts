import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import NotFoundError from '../errors/not-found-err';
import BadRequestError from '../errors/bad-request-err';
import { CREATED } from '../constants/constants';
import ForbiddenError from '../errors/forbidden-err';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    // .populate('user')
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  // записываем данные в базу
  return (
    Card.create({ name, link, owner: _id })
      // возвращаем записанные в базу данные пользователю
      .then((card) => res.status(CREATED).send({ data: card }))
      // если данные не записались, вернём ошибку
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Введены некорректные данные'));
        } else {
          next(err);
        }
      })
  );
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      if (card.owner.toString() !== _id) {
        throw new ForbiddenError('Запрашиваемая карточка создана другим пользователем');
      }
    })
    .then(() => {
      Card.findByIdAndRemove(req.params.cardId)
        .then((card) => {
          res.send({ data: card });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: _id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: _id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};
