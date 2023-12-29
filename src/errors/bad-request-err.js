import { BAD_REQUEST } from '../constants/constants';

export default class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}
