import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import {
  celebrate, Joi, Segments, errors,
} from 'celebrate';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import NotFoundError from './errors/not-found-err';
import { errorHandler } from './middlewares/error-handler';
import auth from './middlewares/auth';
import {
  createUser,
} from './controllers/users';
import login from './controllers/login';
import { requestLogger, errorLogger } from './middlewares/logger';

require('dotenv').config();
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGOOSE_URL_DEFAULT as string);

app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().uri({
      scheme: ['http', 'https'],
    }),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);
// валидация всех заголовков на заголовки с токеном
app.use(celebrate({
  [Segments.HEADERS]: Joi.object().keys({
    cookies: Joi.string(),
  }).unknown(true),
}));
// авторизация
app.use('/users', userRouter);

app.use('/cards', cardRouter);

app.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
