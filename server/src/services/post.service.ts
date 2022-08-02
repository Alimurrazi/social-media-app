import httpStatus from 'http-status';
import { FilterQuery, Types } from 'mongoose';
import { PaginateOptions, QueryResult } from '../models/plugins/paginate.plugin';
import PostModel, { IPost, IPostDoc, IPostQueryWithHelper } from '../models/post.model';
import UserModel, { IUser, IUserMethods, IUserQueryWithHelper } from '../models/user.model';
import ApiError from '../utils/ApiError';

/**
 * Create a user
 * @param {IPost} postBody
 * @returns {Promise<IPostDoc>}
 */
export const createPost = async (postBody: IPost): Promise<IPostDoc> => {
  return PostModel.create(postBody);
};

/**
 * Query for users
 * @param {FilterQuery<IUser>} filter - Mongo filter
 * @param {PaginateOptions} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult<IUser, IUserMethods>>}
 */
export const queryUsers = async (
  filter: FilterQuery<IUser>,
  options: PaginateOptions
): Promise<QueryResult<IUser, IUserMethods>> => {
  const users =
    typeof UserModel.paginate === 'function'
      ? await UserModel.paginate(filter, options)
      : { results: [], page: 0, limit: 0, totalPages: 0, totalResults: 0 };
  return users;
};

/**
 * Get user by id
 * @param {Types.ObjectId} id
 * @returns {Promise<IUserQueryWithHelper>}
 */
export const getPostById = async (id: Types.ObjectId): Promise<IPostQueryWithHelper> => {
  return PostModel.findById(id);
};

/**
 * Get user by id
 * @param {Types.ObjectId} id
 * @returns {Promise<IUserQueryWithHelper>}
 */
 export const getUserById = async (id: Types.ObjectId): Promise<IUserQueryWithHelper> => {
  return UserModel.findById(id);
};

/* Need to complete asap  */
/**
 * Get post by user id
 * @param {Types.ObjectId} userId
 * @returns {Promise<IUserQueryWithHelper>}
 */
 export const getPostByUserId = async (query: any, userId: Types.ObjectId)  => {
  const page = parseInt(query.page);
  const limit = parseInt(query.limit);
  const skipIndex = (page - 1) * limit;
  return await PostModel.find({userId: userId}).sort({ id: 1 })
  .limit(limit)
  .skip(skipIndex);
};

/**
 * Update post by id
 * @param {Types.ObjectId} id
 * @param {Partial<IPost>} updateBody
 * @returns {Promise<IPostDoc>}
 */
export const updateUserById = async (id: Types.ObjectId, updateBody: Partial<IPost>): Promise<IPostDoc> => {
  const post = await getPostById(id);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  Object.assign(post, updateBody);
  await post.save();
  return post;
};

/**
 * Delete user by id
 * @param {Types.ObjectId} postId
 * @returns {Promise<IPostDoc>}
 */
export const deletePostById = async (postId: Types.ObjectId): Promise<IPostDoc> => {
  const post = await getPostById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  await post.remove();
  return post;
};

/**
 * Follow user by id
 * @param {Types.ObjectId} currentUserId
 * @param {Types.ObjectId} userId
 * @returns {Promise<string>}
 */
export const followUserById = async (currentUserId: Types.ObjectId, userId: Types.ObjectId): Promise<string> => {
  const currentUser = await getUserById(currentUserId);
  const user = await getUserById(userId);
  if (!user || !currentUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (!currentUser.followers.includes(userId)) {
    await user.updateOne({ $push: { followers: currentUserId } });
    await currentUser.updateOne({ $push: { followings: userId } });
    return 'succeed';
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'current user already follow this user');
};

/**
 * Follow user by id
 * @param {Types.ObjectId} currentUserId
 * @param {Types.ObjectId} userId
 * @returns {Promise<string>}
 */
export const unfollowUserById = async (currentUserId: Types.ObjectId, userId: Types.ObjectId): Promise<string> => {
  const currentUser = await getUserById(currentUserId);
  const user = await getUserById(userId);
  if (!user || !currentUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (!currentUser.followers.includes(userId)) {
    await user.updateOne({ $pull: { followers: currentUserId } });
    await currentUser.updateOne({ $pull: { followings: userId } });
    return 'succeed';
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'current user already follow this user');
};
