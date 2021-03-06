import httpStatus from 'http-status';
import { FilterQuery, Types } from 'mongoose';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import * as postService from '../services/post.service';
import { IUser } from '../models/user.model';
import { PaginateOptions } from '../models/plugins/paginate.plugin';

export const createPost = catchAsync(async (req, res): Promise<void> => {
  const data = await postService.createPost(req.body);
  res.status(httpStatus.CREATED).send(data);
});

const paginateOptionsKeys: readonly (keyof PaginateOptions)[] = ['limit', 'page', 'populate', 'sortBy'];

export const getUsers = catchAsync(async (req, res): Promise<void> => {
  const filter: FilterQuery<IUser> = pick(req.query, ['name', 'role']) as FilterQuery<IUser>;
  const options = paginateOptionsKeys.reduce<PaginateOptions>(
    (accumulator: PaginateOptions, key: keyof PaginateOptions): PaginateOptions => {
      if (Object.prototype.hasOwnProperty.call(req.query, key)) {
        const value = req.query[key];
        if (value !== null && value !== undefined) {
          accumulator[key] = String(value);
        }
      }
      return accumulator;
    },
    {}
  );
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

export const getPost = catchAsync(async (req, res): Promise<void> => {
  const user = await userService.getUserById(Types.ObjectId(req.params.userId));
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

export const updateUser = catchAsync(async (req, res): Promise<void> => {
  const user = await userService.updateUserById(Types.ObjectId(req.params.userId), req.body);
  res.send(user);
});

export const deleteUser = catchAsync(async (req, res): Promise<void> => {
  await userService.deleteUserById(Types.ObjectId(req.params.userId));
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
