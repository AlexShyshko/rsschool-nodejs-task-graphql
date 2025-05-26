import { Type } from '@fastify/type-provider-typebox';

import {
  getUserId,
  getUserType,
  getUserPostInputType,
  getUserPatchInputType,
  setProfileLoader, 
  setPostLoader,
  setUserSubscribedToLoader,
  setSubscribedToUserLoader,
} from './types/user.js';
import { getMemberTypeId, getMemberTypeType } from './types/member-type.js';
import { getPostId, getPostType, getPostPostInputType, getPostPatchInputType } from './types/post.js';
import { getProfileId, getProfileType, getProfilePostInputType, getProfilePatchInputType, setMemberTypeLoader } from './types/profile.js';

import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLScalarType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLResolveInfo,
} from 'graphql';
import { PrismaClient, Prisma, Profile as ProfilePrismaType, Post as PostPrismaType, User as UserPrismaType, MemberType as MemberTypePrismaType } from '@prisma/client';
import { parseResolveInfo, ResolveTree, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';
import DataLoader from 'dataloader';
import {
  getProfileLoader,
  getPostsLoader,
  getUserSubscribedToLoader,
  getSubscribedToUserLoader,
  getMemberTypeLoader,
} from './loader.js'

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

/* TASK START */

let profileLoader: DataLoader<string, ProfilePrismaType>;
let postsLoader: DataLoader<string, PostPrismaType[]>;
let userSubscribedToLoader: DataLoader<string, UserPrismaType[]>;
let subscribedToUserLoader: DataLoader<string, UserPrismaType[]>;
let memberTypeLoader: DataLoader<string, MemberTypePrismaType>;

let UserId: GraphQLScalarType<string | undefined, string>;
let User: GraphQLObjectType<unknown, unknown>;
let CreateUserInput: GraphQLInputObjectType;
let ChangeUserInput: GraphQLInputObjectType;

let MemberTypeId: GraphQLEnumType;
let MemberType: GraphQLObjectType<unknown, unknown>;

let PostId: GraphQLScalarType<string | undefined, string>;
let Post: GraphQLObjectType<unknown, unknown>;
let CreatePostInput: GraphQLInputObjectType;
let ChangePostInput: GraphQLInputObjectType;

let ProfileId: GraphQLScalarType<string | undefined, string>;
let Profile: GraphQLObjectType<Prisma.UserCreateInput, unknown>;
let CreateProfileInput: GraphQLInputObjectType;
let ChangeProfileInput: GraphQLInputObjectType;

function getRootQueryType(
  profileLoader: DataLoader<string, ProfilePrismaType>,
  postsLoader: DataLoader<string, PostPrismaType[]>,
  userSubscribedToLoader: DataLoader<string, UserPrismaType[]>,
  subscribedToUserLoader: DataLoader<string, UserPrismaType[]>,
) {

  return new GraphQLObjectType({

    name: 'RootQueryType',
    fields: {

      // GET /member-types/
      'memberTypes': {
        type: new GraphQLList(MemberType),

        resolve: async (_parent, _args, context: PrismaClient, _info) => {
          return context.memberType.findMany();
        }
      },

      // GET /member-types/{memberTypeId}
      'memberType': {
        type: MemberType,

        args: {
          id: { type: new GraphQLNonNull(MemberTypeId) },
        },

        resolve: async (_parent, args: Prisma.MemberTypeMinAggregateOutputType, context: PrismaClient, _info) => {
          return context.memberType.findUnique({
            where: { id: args.id! },
          });
        }
      },


      // GET /posts/
      'posts': {
        type: new GraphQLList(Post),

        resolve: async (_parent, _args, context: PrismaClient, _info) => {
          return context.post.findMany();
        }
      },

      // GET /posts/{postId}
      'post': {
        type: Post,

        args: {
          id: { type: new GraphQLNonNull(PostId) },
        },
        
        resolve: async (_parent, args: Prisma.PostMinAggregateOutputType, context: PrismaClient, _info) => {
          return context.post.findUnique({
            where: { id: args.id! },
          });
        }
      },

      // GET /profiles/
      'profiles': {
        type: new GraphQLList(Profile),

        resolve: async (_parent, _args, context: PrismaClient, _info) => {
          return context.profile.findMany();
        }
      },

      // GET /profiles/{profileId}
      'profile': {
        type: Profile,

        args: {
          id: { type: new GraphQLNonNull(ProfileId) },
        },
        
        resolve: async (_parent, args: Prisma.ProfileMinAggregateOutputType, context: PrismaClient, _info) => {
          return context.profile.findUnique({
            where: { id: args.id! },
          });
        }
      },

      // GET /users/
      'users': {
        type: new GraphQLList(User),

        resolve: async (_parent, _args, context: PrismaClient, info: GraphQLResolveInfo) => {

          let isIncludesProfile = false;
          let isIncludesPosts = false;
          let isIncludesUserSubscribedTo = false;
          let isIncludesSubscribedToUser = false;

          const parsedInfo = parseResolveInfo(info);
          const { fields: queriedFields } = simplifyParsedResolveInfoFragmentWithType(parsedInfo as ResolveTree, User);
          const fieldsToInclude = {};
          const queriedFieldsKeys = Object.keys(queriedFields);
          queriedFieldsKeys.forEach((fieldKey) => {
            if (!['id', 'name', 'balance'].includes(fieldKey)) {

              fieldsToInclude[fieldKey] = true;

              switch(fieldKey) {
                case 'profile':
                  isIncludesProfile = true;
                  break;
                case 'posts':
                  isIncludesPosts = true;
                  break;
                case 'userSubscribedTo':
                  isIncludesUserSubscribedTo = true;
                  break;
                case 'subscribedToUser':
                  isIncludesSubscribedToUser = true;
                  break;
              }

            }
          });

          const users = await context.user.findMany({
            include: fieldsToInclude,
          });

          return users;

          // if (isIncludesProfile || isIncludesPosts || isIncludesUserSubscribedTo || isIncludesSubscribedToUser) {

          //   const usersIdArray = users.map((user) => { return user.id });

          //   const profileBatch = isIncludesProfile ? await profileLoader.loadMany(usersIdArray) : null;
          //   const postsBatch = isIncludesPosts ? await postsLoader.loadMany(usersIdArray) : null;
          //   const userSubscribedToBatch = isIncludesUserSubscribedTo ? await userSubscribedToLoader.loadMany(usersIdArray) : null;
          //   const subscribedToUserBatch = isIncludesSubscribedToUser ? await subscribedToUserLoader.loadMany(usersIdArray) : null;

          //   const profileBatchResolved = isIncludesProfile ? await Promise.all(profileBatch!) : null;
          //   const postsBatchResolved = isIncludesPosts ? await Promise.all(postsBatch!) : null;
          //   const userSubscribedToBatchResolved = isIncludesUserSubscribedTo ? await Promise.all(userSubscribedToBatch!) : null;
          //   const subscribedToUserBatchResolved = isIncludesSubscribedToUser ? await Promise.all(subscribedToUserBatch!) : null;

          //   return users.map((user, index) => {

          //     return {
          //       ...user,
          //       ...(isIncludesProfile && { profile: profileBatchResolved![index] }),
          //       ...(isIncludesPosts && { posts: postsBatchResolved![index] }),
          //       ...(isIncludesUserSubscribedTo && { userSubscribedTo: userSubscribedToBatchResolved![index] }),
          //       ...(isIncludesSubscribedToUser && { subscribedToUser: subscribedToUserBatchResolved![index] }),
          //     };

          //   });

          // } else {
          //   return users;
          // }

        }
      },

      // GET /users/{userId}
      'user': {
        type: User,

        args: {
          id: { type: new GraphQLNonNull(UserId) },
        },
        
        resolve: async (_parent, args: Prisma.UserCreateInput, context: PrismaClient, _info: GraphQLResolveInfo) => {
          const result = await context.user.findUnique({
            where: { id: args.id! },
          });
          return result;
        }
      },

      // GET /users/{userId}/posts/
      'userPosts': {
        type: new GraphQLList(Post),

        args: {
          id: { type: new GraphQLNonNull(UserId) },
        },

        resolve: async (_parent, args: Prisma.UserCreateInput, context: PrismaClient, _info) => {
          return context.post.findMany({
            where: { authorId: args.id! },
          });
        }
      },

      // GET /users/{userId}/profile/
      'userProfile': {
        type: Profile,

        args: {
          id: { type: new GraphQLNonNull(UserId) },
        },

        resolve: async (_parent, args: Prisma.UserCreateInput, context: PrismaClient, _info) => {
          return context.profile.findUnique({
            where: { userId: args.id! },
          });
        }
      },

      // GET /users/{userId}/subscribed-to-user/
      'userSubscribers': {
        type: new GraphQLList(User),

        args: {
          id: { type: new GraphQLNonNull(UserId) },
        },

        resolve: async (_parent, args: Prisma.UserCreateInput, _context, _info) => {
          const subscribedToUserBatch = await subscribedToUserLoader.load(args.id as string);
          subscribedToUserLoader.prime(args.id!, subscribedToUserBatch);
          return subscribedToUserBatch;
          // const subscribers = await context.subscribersOnAuthors.findMany({
          //   include: { subscriber: true, author: true },
          //   where: { authorId: args.id! },
          // });
          // return subscribers.map(async (subscription) => {
          //   return await context.user.findUnique({
          //     include: { profile: true, posts: true, userSubscribedTo: true, subscribedToUser: true },
          //     where: { id: subscription.subscriberId },
          //   });
          // });
        }
      },

      // GET /users/{userId}/user-subscribed-to
      'userSubscriptions': {
        type: new GraphQLList(User),

        args: {
          id: { type: new GraphQLNonNull(UserId) },
        },

        resolve: async (_parent, args: Prisma.UserCreateInput, _context, _info) => {
          const userSubscribedToBatch = await userSubscribedToLoader.load(args.id as string);
          userSubscribedToLoader.prime(args.id!, userSubscribedToBatch);
          return userSubscribedToBatch;
          // const subscriptions = await context.subscribersOnAuthors.findMany({
          //   include: { subscriber: true, author: true },
          //   where: { subscriberId: args.id! },
          // });
          // return subscriptions.map(async (subscription) => {
          //   return await context.user.findUnique({
          //     include: { profile: true, posts: true, userSubscribedTo: true, subscribedToUser: true },
          //     where: { id: subscription.authorId },
          //   });
          // });
        }
      },

    },

  });

}

function getMutations() {

  return new GraphQLObjectType({

    name: 'Mutations',
    fields: {

      // POST /posts/
      'createPost': {
        type: Post,

        args: {
          dto: { type: new GraphQLNonNull(CreatePostInput) },
        },

        resolve: async (_parent, args: { dto: Prisma.PostCreateInput }, context: PrismaClient, _info) => {
          return await context.post.create({
            data: args.dto,
          });
        },

      },

      // PATCH /posts/{postId}
      'changePost': {
        type: Post,

        args: {
          id: { type: new GraphQLNonNull(PostId) },
          dto: { type: new GraphQLNonNull(ChangePostInput) },
        },

        resolve: async (_parent, args: { id: string; dto: Prisma.PostUpdateInput }, context: PrismaClient, _info) => {
          return await context.post.update({
            where: { id: args.id },
            data: args.dto,
          });
        },

      },

      // DELETE /posts/{postId}
      'deletePost': {
        type: GraphQLString,

        args: {
          id: { type: new GraphQLNonNull(PostId) },
        },

        resolve: async (_parent, args: Prisma.PostMinAggregateOutputType, context: PrismaClient, _info) => {
          const deletedRecord = await context.post.delete({
            where: { id: args.id! },
          });
          return deletedRecord ? 'Record was deleted' : 'Record was not deleted';
        },

      },

      // POST /profiles/
      'createProfile': {
        type: Profile,

        args: {
          dto: { type: new GraphQLNonNull(CreateProfileInput) },
        },

        resolve: async (_parent, args: { dto: Prisma.ProfileCreateInput }, context: PrismaClient, _info) => {
          return await context.profile.create({
            data: args.dto,
          });
        },

      },

      // PATCH /profiles/{profileId}
      'changeProfile': {
        type: Profile,

        args: {
          id: { type: new GraphQLNonNull(ProfileId) },
          dto: { type: new GraphQLNonNull(ChangeProfileInput) },
        },

        resolve: async (_parent, args: { id: string; dto: Prisma.ProfileUpdateInput }, context: PrismaClient, _info) => {
          return await context.profile.update({
            where: { id: args.id },
            data: args.dto,
          });
        },

      },

      // DELETE /profiles/{profileId}
      'deleteProfile': {
        type: GraphQLString,

        args: {
          id: { type: new GraphQLNonNull(ProfileId) },
        },

        resolve: async (_parent, args: Prisma.ProfileMinAggregateOutputType, context: PrismaClient, _info) => {
          const deletedRecord = await context.profile.delete({
            where: { id: args.id! },
          });
          return deletedRecord ? 'Record was deleted' : 'Record was not deleted';
        },

      },

      // POST /users/
      'createUser': {
        type: User,

        args: {
          dto: { type: new GraphQLNonNull(CreateUserInput) },
        },

        resolve: async (_parent, args: { dto: Prisma.UserCreateInput }, context: PrismaClient, _info) => {
          return await context.user.create({
            data: args.dto,
          });
        },

      },

      // PATCH /users/{userId}
      'changeUser': {
        type: User,

        args: {
          id: { type: new GraphQLNonNull(UserId) },
          dto: { type: new GraphQLNonNull(ChangeUserInput) },
        },

        resolve: async (_parent, args: { id: string; dto: Prisma.UserUpdateInput }, context: PrismaClient, _info) => {
          return await context.user.update({
            where: { id: args.id },
            data: args.dto,
          });
        },

      },

      // DELETE /users/{userId}
      'deleteUser': {
        type: GraphQLString,

        args: {
          id: { type: new GraphQLNonNull(UserId) },
        },

        resolve: async (_parent, args: Prisma.UserCreateInput, context: PrismaClient, _info) => {
          const deletedRecord = await context.user.delete({
            where: { id: args.id! },
          });
          return deletedRecord ? 'Record was deleted' : 'Record was not deleted';
        },

      },

      // POST /users/{userId}/user-subscribed-to/
      'subscribeTo': {
        type: GraphQLString,

        args: {
          userId: { type: new GraphQLNonNull(UserId) },
          authorId: { type: new GraphQLNonNull(UserId) },
        },

        resolve: async (_parent, args: { userId: string; authorId: string }, context: PrismaClient, _info) => {
          const createdRecord = await context.subscribersOnAuthors.create({
            data: {
              subscriberId: args.userId,
              authorId: args.authorId,
            },
          });
          return createdRecord ? 'User was subscribed' : 'User was not subscribed';
        },

      },

      // DELETE /users/{userId}/user-subscribed-to/{authorId}
      'unsubscribeFrom': {
        type: GraphQLString,

        args: {
          userId: { type: new GraphQLNonNull(UserId) },
          authorId: { type: new GraphQLNonNull(UserId) },
        },

        resolve: async (_parent, args: { userId: string; authorId: string }, context: PrismaClient, _info) => {
          const deletedRecord = await context.subscribersOnAuthors.delete({
            where: {
              subscriberId_authorId: {
                subscriberId: args.userId,
                authorId: args.authorId,
              },
            },
          });
          return deletedRecord ? 'User was unsubscribed' : 'User was not unsubscribed';
        },

      },

    },

  });

}

async function getSchema_GQL(prismaInstance: PrismaClient) {

  profileLoader = getProfileLoader(prismaInstance);
  postsLoader = getPostsLoader(prismaInstance);
  userSubscribedToLoader = getUserSubscribedToLoader(prismaInstance);
  subscribedToUserLoader = getSubscribedToUserLoader(prismaInstance);
  memberTypeLoader = getMemberTypeLoader(prismaInstance);

  setProfileLoader(profileLoader);
  setPostLoader(postsLoader);
  setUserSubscribedToLoader(userSubscribedToLoader);
  setSubscribedToUserLoader(subscribedToUserLoader);
  setMemberTypeLoader(memberTypeLoader);

  UserId = getUserId();
  User = getUserType();
  CreateUserInput = getUserPostInputType();
  ChangeUserInput = getUserPatchInputType();

  MemberTypeId = getMemberTypeId();
  MemberType = getMemberTypeType();

  PostId = getPostId();
  Post = getPostType();
  CreatePostInput = getPostPostInputType();
  ChangePostInput = getPostPatchInputType();

  ProfileId = getProfileId();
  Profile = getProfileType();
  CreateProfileInput = getProfilePostInputType();
  ChangeProfileInput = getProfilePatchInputType();

  // const users = await prismaInstance.user.findMany({
  //   include: { profile: true, posts: true, userSubscribedTo: true, subscribedToUser: true },
  // });

  // const usersIdArray = users.map((user) => { return user.id });

  // const userBatch = await userLoader.loadMany(usersIdArray);
  // const userBatchResolved = await Promise.all(userBatch);

  // usersIdArray.forEach((userId, index) => {
  //   userLoader.prime(userId, userBatchResolved[index]);
  // });

  // const profileBatch = await profileLoader.loadMany(usersIdArray);
  // const postsBatch = await postsLoader.loadMany(usersIdArray);
  // const userSubscribedToBatch = await userSubscribedToLoader.loadMany(usersIdArray);
  // const subscribedToUserBatch = await subscribedToUserLoader.loadMany(usersIdArray);

  // const profileBatchResolved = await Promise.all(profileBatch);
  // const postsBatchResolved = await Promise.all(postsBatch);
  // const userSubscribedToBatchResolved = await Promise.all(userSubscribedToBatch);
  // const subscribedToUserBatchResolved = await Promise.all(subscribedToUserBatch);

  return new GraphQLSchema({
    query: getRootQueryType(profileLoader, postsLoader, userSubscribedToLoader, subscribedToUserLoader),
    mutation: getMutations(),
  });

}

export { getSchema_GQL };