import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from './constants/constants';
import NotFoundError from './errors/not-found-err';
import { errorHandler } from './middlewares/error-handler';


// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use((req:Request, res:any, next) => {
  req.user = {
    _id: '658ae04ef7077ce7924bad27',
  };

  next();
});

app.use('/users', userRouter);

app.use('/cards', cardRouter);

app.use('*', (req: Request, res: Response, next: NextFunction)=> {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

 app.use(errorHandler);

app.listen(PORT);
