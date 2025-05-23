import { Type } from '@fastify/type-provider-typebox';

import { getUserId, getUserType } from './types/user.js';
import { getMemberTypeId, getMemberTypeType } from './types/member-type.js';
import { getPostId, getPostType, getPostPostInputType, getPostPatchInputType } from './types/post.js';
import { getProfileType } from './types/profile.js';
import { getSubscribersOnAuthorsType } from './types/subscribers-on-authors.js';

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
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

interface RequiredArguments {
  memberTypeId?: string;
  postId?: string;
  profileId?: string;
  userId?: string;
};
interface InputBodyArguments {
  title?: string;
  content?: string;
  authorId?: string;
};
interface InputBody {
  body: InputBodyArguments;
};
interface InputBodyWithArguments extends RequiredArguments, InputBody {};

const UserId = getUserId();
const UserType = getUserType();
const MemberTypeId = getMemberTypeId();
const MemberTypeType = getMemberTypeType();
const PostId = getPostId();
const PostType = getPostType();
const PostPostInputType = getPostPostInputType();
const PostPatchInputType = getPostPatchInputType();
const ProfileType = getProfileType();
const SubscribersOnAuthorsType = getSubscribersOnAuthorsType();

const Query_GQL = new GraphQLObjectType({
  name: 'Query_GQL',
  fields: {

    'GET__member_types': {
      type: new GraphQLList(MemberTypeType),

      resolve: async (_parent, _args, context: PrismaClient, _info) => {
        return context.memberType.findMany();
      }
    },

    'GET__member_types__memberTypeId': {
      type: MemberTypeType,

      args: {
        memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
      },

      resolve: async (_parent, args: RequiredArguments, context: PrismaClient, _info) => {
        return context.memberType.findUnique({
          where: { id: args.memberTypeId },
        });
      }
    },

    'GET__posts': {
      type: new GraphQLList(PostType),

      resolve: async (_parent, _args, context: PrismaClient, _info) => {
        return context.post.findMany();
      }
    },

    'GET__posts__postId': {
      type: PostType,

      args: {
        postId: { type: new GraphQLNonNull(PostId) },
      },
      
      resolve: async (_parent, args: RequiredArguments, context: PrismaClient, _info) => {
        return context.post.findUnique({
          where: { id: args.postId },
        });
      }
    },

    //GET__profiles
    //GET__profiles__profileId

    //GET__stats__prisma

    //GET__users
    //GET__users__userId

    
    //GET__users__userId__posts

    //GET__users__userId__profile

    //GET__users__userId__subscribed_to_user

    //GET__users__userId__user_subscribed_to

  },
});

const Mutation_GQL = new GraphQLObjectType({
  name: 'Mutation_GQL',
  fields: {

    'POST__posts': {
      type: PostType,

      args: {
        body: { type: new GraphQLNonNull(PostPostInputType) },
      },

      resolve: async (_parent, args: InputBody, context: PrismaClient, _info) => {
        return await context.post.create({
          data: args.body as Prisma.PostCreateInput,
        });
      },

    },

    'PATCH__posts__postId': {
      type: PostType,

      args: {
        postId: { type: new GraphQLNonNull(PostId) },
        body: { type: new GraphQLNonNull(PostPatchInputType) },
      },

      resolve: async (_parent, args: InputBodyWithArguments, context: PrismaClient, _info) => {
        return await context.post.update({
          where: { id: args.postId },
          data: args.body,
        });
      },

    },

    'DELETE__posts__postId': {
      type: GraphQLBoolean,

      args: {
        postId: { type: new GraphQLNonNull(PostId) },
      },

      resolve: async (_parent, args: RequiredArguments, context: PrismaClient, _info) => {
        return await context.post.delete({
          where: { id: args.postId },
        });
      },

    },

    // POST__profiles
    // PATCH__profiles__profileId
    // DELETE__profiles__profileId

    // POST__users
    // PATCH__users__userId
    // DELETE__profiles__userId

    // POST__users__userId__user_subscribed_to
    // DELETE__users__userId__user_subscribed_to__authorId
  },
});

const Schema_GQL = new GraphQLSchema({
  query: Query_GQL,
  mutation: Mutation_GQL,
});

export { Schema_GQL };