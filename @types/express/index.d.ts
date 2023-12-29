// import { ObjectId } from 'mongoose';

// eslint-disable-next-line no-unused-vars
declare namespace Express {
    // eslint-disable-next-line no-unused-vars
    export interface Request {
      user: { _id: string };
    }
  }
