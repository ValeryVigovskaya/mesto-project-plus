import { UNAUTHORIZED_ERROR } from '../constants/constants';

export default class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR;
  }
}
