import httpStatus from 'http-status';
import { Types } from 'mongoose';
import PostModel, { IPost, IPostDoc, IPostQueryWithHelper } from '../models/post.model';
import UserModel, { IUserQueryWithHelper } from '../models/user.model';
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

/**
 * Get post by user id
 * @param {Types.ObjectId} userId
 * @returns {Promise<IUserQueryWithHelper>}
 */
export const getPostByUserId = async (query: any, userId: Types.ObjectId) => {
  let { page, limit, sortBy } = query;
  page = page || 1;
  limit = limit || 10;
  sortBy = sortBy || -1;

  const skipIndex = (page - 1) * limit;
  return PostModel.find({ userId }).sort({ createdAt: sortBy }).limit(limit).skip(skipIndex);
};

/**
 * Get post by user id
 * @param {any} query
 * @param {Types.ObjectId} userIds
 * @returns {Promise<IUserQueryWithHelper>}
 */
export const getTimelinePostByUserIds = async (query: any, userIds: Types.ObjectId[]) => {
  let { page, limit, sortBy } = query;
  page = page || 1;
  limit = limit || 10;
  sortBy = sortBy || -1;

  const skipIndex = (page - 1) * limit;
  return PostModel.find({ userId: { $in: userIds } })
    .sort({ createdAt: sortBy })
    .limit(limit)
    .skip(skipIndex);
};

/**
 * Update post by id
 * @param {Types.ObjectId} userId
 * @param {Types.ObjectId} postId
 * @param {Partial<IPost>} updateBody
 * @returns {Promise<IPostDoc>}
 */
export const updatePostById = async (
  userId: Types.ObjectId,
  postId: Types.ObjectId,
  updateBody: Partial<IPost>
): Promise<IPostDoc> => {
  const post = await getPostById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  if (String(post.userId) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You have no acess to update');
  }
  Object.assign(post, updateBody);
  await post.save();
  return post;
};

/**
 * Delete post by id
 * @param {Types.ObjectId} userId
 * @param {Types.ObjectId} postId
 * @returns {Promise<IPostDoc>}
 */
export const deletePostById = async (userId: Types.ObjectId, postId: Types.ObjectId): Promise<IPostDoc> => {
  const post = await getPostById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  if (String(post.userId) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You have no acess to delete');
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
 * Like post with userId
 * @param {Types.ObjectId} currentUserId
 * @param {Types.ObjectId} postId
 * @returns {Promise<string>}
 */
export const likePostByUserId = async (currentUserId: Types.ObjectId, postId: Types.ObjectId): Promise<string> => {
  const post = await getPostById(postId);
  if (post && !post.likes.includes(currentUserId)) {
    await post.updateOne({ $push: { likes: currentUserId } });
    return 'succeed';
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'current user already liked this post');
};

/**
 * Follow user by id
 * @param {Types.ObjectId} currentUserId
 * @param {Types.ObjectId} postId
 * @returns {Promise<string>}
 */
export const unlikePostByUserId = async (currentUserId: Types.ObjectId, postId: Types.ObjectId): Promise<string> => {
  const post = await getPostById(postId);
  if (post && post.likes.includes(currentUserId)) {
    await post.updateOne({ $pull: { likes: currentUserId } });
    return 'succeed';
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'current user already unliked this post');
};
