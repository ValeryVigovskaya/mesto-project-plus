import { NOT_FOUND } from '../constants/constants';

export default class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}
