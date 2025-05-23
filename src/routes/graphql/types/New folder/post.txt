import {
    GraphQLObjectTypeConfig,
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';
import { PostTypeConfig, setUserTypeGetter } from './post-generic.js';
import { UUIDType } from './uuid.js';
import { UserTypeConfig } from './user-generic.js';

const PostType = new GraphQLObjectType(PostTypeConfig);

const UserType = new GraphQLObjectType(UserTypeConfig);
setUserTypeGetter(() => { return UserType });

export { PostType };