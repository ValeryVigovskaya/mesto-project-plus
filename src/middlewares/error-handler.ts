import { Request, Response } from 'express';
import { INTERNAL_SERVER_ERROR } from '../constants/constants';

interface ICustomError extends Error {
  statusCode: number;
}
export const errorHandler = (
  err: ICustomError,
  req: Request,
  res: Response,
) => {
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка' : message,
    });
};

export default { errorHandler };
