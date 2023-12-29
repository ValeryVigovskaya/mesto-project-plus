import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { INTERNAL_SERVER_ERROR } from './constants/constants';

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req:Request, res:any, next) => {
  req.user = {
    _id: '658ae04ef7077ce7924bad27',
  };

  next();
});

app.use('/users', userRouter);

app.use('/cards', cardRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка' : message,
    });

  next();
});

app.listen(PORT);
