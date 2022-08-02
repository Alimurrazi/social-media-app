import { model, Document, Schema, Types, Model, QueryWithHelpers, EnforceDocument } from 'mongoose';
import toJSON from './plugins/toJSON.plugin';

export interface IPost {
  userId: Types.ObjectId;
  description: string;
  img: string;
  likes: Types.ObjectId[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPostModel extends Model<IPost, Record<string, never>, Record<string, never>> {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IPostDoc = IPost & Document<Record<string, any>, Record<string, never>, IPost>;

export type IPostQueryWithHelper = Promise<(IPost & Document<any, any, IPost>) | null>;

// const postSchema = new Schema<IPost, IPostModel>(
const postSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      default: '',
    },
    likes: {
      type: [Types.ObjectId],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
postSchema.plugin(toJSON);

// const PostModel: IPostModel = model<IPost>('Post', postSchema);
const PostModel = model<IPost>('Post', postSchema);

export default PostModel;
