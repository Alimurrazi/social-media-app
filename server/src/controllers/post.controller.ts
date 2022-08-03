import httpStatus from 'http-status';
import { Types } from 'mongoose';
import * as postService from '../services/post.service';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';

export const createPost = catchAsync(async (req: any, res): Promise<void> => {
  const post = req.body;
  if (req.user && req.user.id) {
    post.userId = req.user.id;
    const data = await postService.createPost(post);
    res.status(httpStatus.CREATED).send(data);
  } else {
    res.status(httpStatus.BAD_REQUEST);
  }
});

export const getPost = catchAsync(async (req, res): Promise<void> => {
  const post = await postService.getPostById(Types.ObjectId(req.params.postId));
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  res.send(post);
});

export const getUserPost = catchAsync(async (req, res): Promise<void> => {
  const post = await postService.getPostByUserId(req.query, Types.ObjectId(req.params.postId));
  res.send(post);
});

export const updatePost = catchAsync(async (req: any, res): Promise<void> => {
  const user = await postService.updatePostById(Types.ObjectId(req.user.id), Types.ObjectId(req.params.postId), req.body);
  res.send(user);
});

export const deletePost = catchAsync(async (req: any, res): Promise<void> => {
  await postService.deletePostById(Types.ObjectId(req.user.id), Types.ObjectId(req.params.postId));
  res.status(httpStatus.NO_CONTENT).send();
});

export const likePost = catchAsync(async (req: any, res): Promise<void> => {
  if (req.user && req.user.id) {
    const status = await postService.likePostByUserId(req.user.id, Types.ObjectId(req.params.postId));
    res.send(status);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Loggedin user not found');
  }
});

export const unlikePost = catchAsync(async (req: any, res): Promise<void> => {
  if (req.user && req.user.id) {
    const status = await postService.unlikePostByUserId(req.user.id, Types.ObjectId(req.params.postId));
    res.send(status);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Loggedin user not found');
  }
});
