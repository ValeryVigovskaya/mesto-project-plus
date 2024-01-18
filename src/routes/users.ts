import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUserMe,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);

router.get('/me', getUserMe);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().hex(),
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
    avatar: Joi.string().uri({
      scheme: ['http', 'https'],
    }).required(),
  }),
}), updateAvatar);

export default router;
