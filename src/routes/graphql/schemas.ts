import { Type } from '@fastify/type-provider-typebox';

import { getUserId, getUserType, getUserPostInputType, getUserPatchInputType } from './types/user.js';
import { getMemberTypeId, getMemberTypeType } from './types/member-type.js';
import { getPostId, getPostType, getPostPostInputType, getPostPatchInputType } from './types/post.js';
import { getProfileId, getProfileType, getProfilePostInputType, getProfilePatchInputType } from './types/profile.js';

import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { PrismaClient, Prisma } from '@prisma/client';


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

const UserId = getUserId();
const User = getUserType();
const CreateUserInput = getUserPostInputType();
const ChangeUserInput = getUserPatchInputType();

const MemberTypeId = getMemberTypeId();
const MemberType = getMemberTypeType();

const PostId = getPostId();
const Post = getPostType();
const CreatePostInput = getPostPostInputType();
const ChangePostInput = getPostPatchInputType();

const ProfileId = getProfileId();
const Profile = getProfileType();
const CreateProfileInput = getProfilePostInputType();
const ChangeProfileInput = getProfilePatchInputType();

const RootQueryType = new GraphQLObjectType({
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

      resolve: async (_parent, _args, context: PrismaClient, _info) => {
        return context.user.findMany();
      }
    },

    // GET /users/{userId}
    'user': {
      type: User,

      args: {
        id: { type: new GraphQLNonNull(UserId) },
      },
      
      resolve: async (_parent, args: Prisma.UserMinAggregateOutputType, context: PrismaClient, _info) => {
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

      resolve: async (_parent, args: Prisma.UserMinAggregateOutputType, context: PrismaClient, _info) => {
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

      resolve: async (_parent, args: Prisma.UserMinAggregateOutputType, context: PrismaClient, _info) => {
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

      resolve: async (_parent, args: Prisma.UserMinAggregateOutputType, context: PrismaClient, _info) => {
        const subscribers = await context.subscribersOnAuthors.findMany({
            include: { subscriber: true, author: true },
            where: { authorId: args.id! },
        });
        return subscribers.map(async (subscription) => {
            return await context.user.findUnique({
                include: { profile: true, posts: true, userSubscribedTo: true, subscribedToUser: true },
                where: { id: subscription.subscriberId },
            });
        });
      }
    },

    // GET /users/{userId}/user-subscribed-to
    'userSubscriptions': {
      type: new GraphQLList(User),

      args: {
        id: { type: new GraphQLNonNull(UserId) },
      },

      resolve: async (_parent, args: Prisma.UserMinAggregateOutputType, context: PrismaClient, _info) => {
        const subscriptions = await context.subscribersOnAuthors.findMany({
            include: { subscriber: true, author: true },
            where: { subscriberId: args.id! },
        });
        return subscriptions.map(async (subscription) => {
            return await context.user.findUnique({
                include: { profile: true, posts: true, userSubscribedTo: true, subscribedToUser: true },
                where: { id: subscription.authorId },
            });
        });
      }
    },

  },
});

const Mutations = new GraphQLObjectType({
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

      resolve: async (_parent, args: Prisma.UserMinAggregateOutputType, context: PrismaClient, _info) => {
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

const Schema_GQL = new GraphQLSchema({
  query: RootQueryType,
  mutation: Mutations,
});

export { Schema_GQL };