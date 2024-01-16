import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUserMe
} from '../controllers/users';
import { celebrate, Joi } from 'celebrate';

const router = Router();

router.get('/', getUsers);

router.get('/me', getUserMe);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateAvatar);

export default router;
