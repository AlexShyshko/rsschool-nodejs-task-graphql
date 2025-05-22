import { Type } from '@fastify/type-provider-typebox';
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

interface BaseQueryArguments {
    id: string;
}
interface MemberTypeQueryArguments {
    id: 'BASIC' | 'BUSINESS';
}
const MemberType_GQL = new GraphQLObjectType({
    name: 'MemberType_GQL',
    fields: () => ({
        id: { type: GraphQLString },
        discount: { type: GraphQLFloat },
        postsLimitPerMonth: { type: GraphQLInt },
    })
});
const Post_GQL = new GraphQLObjectType({
    name: 'Post_GQL',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLID },
        content: { type: GraphQLID },
        authorId: { type: GraphQLID },
    })
});

const Query_GQL = new GraphQLObjectType({
  name: 'Query_GQL',
  fields: () => ({

    GET_MemberTypes: {
      type: new GraphQLList(MemberType_GQL),

      resolve: async (_parent, args, context: PrismaClient, _info) => {
        return context.memberType.findMany();
      }
    },

    GET_MemberTypes_memberTypeId: {
      type: MemberType_GQL,

      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },

      resolve: async (_parent, args: MemberTypeQueryArguments, context: PrismaClient, _info) => {
        const id = args.id;
        return context.memberType.findUnique({
          where: { id },
        });
      }
    },

    GET_Posts: {
      type: new GraphQLList(Post_GQL),

      resolve: async (_parent, args, context: PrismaClient, _info) => {
        return context.post.findMany();
      }
    },

    // POST_Posts: {},

    // GET_Posts_postId: {},

  })
});

const Schema_GQL = new GraphQLSchema({
  query: Query_GQL,
});

export { Schema_GQL };