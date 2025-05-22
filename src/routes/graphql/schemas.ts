import { Type } from '@fastify/type-provider-typebox';
import { MemberTypeId, MemberTypeType } from './types/member-type.js';
import { PostType } from './types/post.js';


import { UserType } from './types/user.js';
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

// interface PostBodyArguments_POST {
//     title: string;
//     content: string;
//     authorId: string;
// }
// interface PostBodyArguments_Patch {
//     title?: string;
//     content?: string;
// }

// const Post_Mutation_POST = new GraphQLObjectType({
//     name: 'Post_Mutation_POST',
//     fields: () => ({
//         title: { type: new GraphQLNonNull(GraphQLID) },
//         content: { type: new GraphQLNonNull(GraphQLID) },
//         authorId: { type: new GraphQLNonNull(GraphQLID) },
//     })
// });

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
  mutation: Mutation_GQL,
});

export { Schema_GQL };