import httpStatus from 'http-status';
import { Types } from 'mongoose';
import * as postService from '../services/post.service';
import * as userService from '../services/user.service';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';

export const createPost = catchAsync(async (req, res): Promise<void> => {
  const data = await postService.createPost(req.body);
  res.status(httpStatus.CREATED).send(data);
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

export const updatePost = catchAsync(async (req, res): Promise<void> => {
  const user = await postService.updatePostById(Types.ObjectId(req.params.userId), req.body);
  res.send(user);
});

export const deletePost = catchAsync(async (req, res): Promise<void> => {
  await postService.deletePostById(Types.ObjectId(req.params.userId));
  res.status(httpStatus.NO_CONTENT).send();
});

export const followUser = catchAsync(async (req: any, res): Promise<void> => {
  if (req.user && req.user.id) {
    const status = await userService.followUserById(req.user.id, Types.ObjectId(req.params.userId));
    res.send(status);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Loggedin user not found');
  }
});

export const unfollowUser = catchAsync(async (req: any, res): Promise<void> => {
  if (req.user && req.user.id) {
    const status = await userService.unfollowUserById(req.user.id, Types.ObjectId(req.params.userId));
    res.send(status);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Loggedin user not found');
  }
});
