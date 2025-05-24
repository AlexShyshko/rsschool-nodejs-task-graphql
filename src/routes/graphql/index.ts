import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, Schema_GQL } from './schemas.js';
import { graphql, parse, validate, GraphQLArgs } from 'graphql';
import depthLimit from 'graphql-depth-limit';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {

  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },

    async handler(req) {

      const errors = validate(Schema_GQL, parse(req.body.query), [depthLimit(5)]);

      if (errors.length) {
        return { errors };
      }

      const passedArgs: GraphQLArgs = {
        schema: Schema_GQL,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: prisma,
      };

      const result = await graphql(passedArgs);

      return result;

    },

  });

};

export default plugin;
