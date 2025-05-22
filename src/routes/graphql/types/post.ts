import {
    GraphQLObjectTypeConfig,
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';
import { PostTypeConfig } from './post-generic.js';
import { UUIDType } from './uuid.js';
import { UserTypeConfig } from './user-generic.js';

const PostType = new GraphQLObjectType(PostTypeConfig);

export { PostType };