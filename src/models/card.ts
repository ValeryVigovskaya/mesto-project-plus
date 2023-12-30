import { model, Schema } from 'mongoose';
import validator from 'validator';

interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  createdAt: Date;
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    required: [true, 'Поле "name" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  link: {
    type: String,
    required: [true, 'Поле "link" должно быть заполнено'],
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Некорректный URL',
    }
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле "owner" обязательное'],
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле "likes" обязательное'],
    default: [[], 'Начальный массив поля "likes" должен быть пустым'],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

// TS-интерфейс модели Card
export default model<ICard>('Card', cardSchema);
