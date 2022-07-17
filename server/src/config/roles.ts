export type RoleNames = 'admin' | 'user';

const allRoles: { [key: string]: readonly string[] } = Object.freeze({
  user: Object.freeze(['getUsers', 'follow', 'post']),
  admin: Object.freeze(['getUsers', 'manageUsers', 'post']),
});

export const roles = Object.freeze(Object.keys(allRoles));
export const roleRights = new Map(Object.entries(allRoles));
