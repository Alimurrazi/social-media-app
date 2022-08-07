import Joi from 'joi';
import { objectId } from './custom.validation';

export const createPost = {
  body: Joi.object().keys({
    description: Joi.string().required(),
    img: Joi.string().optional().allow(''),
  }),
};

export const getUserPosts = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const timeline = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getPost = {
  params: Joi.object().keys({
    postId: Joi.string().custom(objectId),
  }),
};

export const updatePost = {
  params: Joi.object().keys({
    postId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      description: Joi.string(),
      img: Joi.string(),
      likes: Joi.array().items(Joi.string()),
    })
    .min(1),
};

export const deletePost = {
  params: Joi.object().keys({
    postId: Joi.string().custom(objectId),
  }),
};
