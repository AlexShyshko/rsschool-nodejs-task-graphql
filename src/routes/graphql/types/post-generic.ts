import {
    GraphQLObjectTypeConfig,
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { UserTypeConfig } from './user-generic.js';

const UserType = new GraphQLObjectType(UserTypeConfig as GraphQLObjectTypeConfig<unknown, unknown>);

const PostTypeConfig = {
    name: 'PostType',
    fields: () => ({
        id: { type: UUIDType },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        author: { type: UserType },
        authorId: { type: UserType.getFields().id.type },
    }),
};

export { PostTypeConfig };