// // import { ObjectId } from 'mongoose';
//  import { JwtPayload } from 'jsonwebtoken';

//eslint-disable-next-line no-unused-vars
declare namespace Express {
    // eslint-disable-next-line no-unused-vars
    export interface Request {
      user: { _id: string };
    }
  }
