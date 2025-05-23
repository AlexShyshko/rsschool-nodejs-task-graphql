import { Type } from '@fastify/type-provider-typebox';

import { getUserType } from './types/user.js';
import { getMemberTypeId, getMemberTypeType } from './types/member-type.js';
import { getPostType } from './types/post.js';
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
  GraphQLID,
} from 'graphql';
import { PrismaClient } from '@prisma/client';

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
  memberTypeId_REQUIRED?: string;
  postId_REQUIRED?: string;
  profileId_REQUIRED?: string;
  userId_REQUIRED?: string;
};

const UserType = getUserType();
const MemberTypeId = getMemberTypeId();
const MemberTypeType = getMemberTypeType();
const PostType = getPostType();
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
        memberTypeId_REQUIRED: { type: new GraphQLNonNull(MemberTypeId) },
      },

      resolve: async (_parent, args: RequiredArguments, context: PrismaClient, _info) => {
        return context.memberType.findUnique({
          where: { id: args.memberTypeId_REQUIRED },
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
        postId_REQUIRED: { type: new GraphQLNonNull(GraphQLID) },
      },
      
      resolve: async (_parent, args: RequiredArguments, context: PrismaClient, _info) => {
        return context.post.findUnique({
          where: { id: args.postId_REQUIRED },
        });
      }
    },

  },
});

const Mutation_GQL = new GraphQLObjectType({
  name: 'Mutation_GQL',
  fields: {

    // 'POST__posts': {
    //   type: PostType,

    //   args: {

    //   },

    //   resolve: async (_parent, args: PostBodyArguments_POST, context: PrismaClient, _info) => {
    //     return await context.post.create({
    //       data: args,
    //     });
    //   },

    // },

    //'PATCH__posts__postId'
    //'DELETE__posts__postId'

  },
});

const Schema_GQL = new GraphQLSchema({
  query: Query_GQL,
  //mutation: Mutation_GQL,
});

export { Schema_GQL };