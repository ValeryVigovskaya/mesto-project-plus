import { CONFLICT_ERROR } from '../constants/constants';

export default class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_ERROR;
  }
}
