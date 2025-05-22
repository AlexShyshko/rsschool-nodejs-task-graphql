import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLList
} from 'graphql';
import { PostTypeConfig } from './post-generic.js';
import { ProfileTypeConfig } from './profile-generic.js';
import { UUIDType } from './uuid.js';
//import { PostType } from './post.js';

const PostType = new GraphQLObjectType(PostTypeConfig);
const ProfileType = new GraphQLObjectType(ProfileTypeConfig);
/* ∨ Crutch to avoid circular dependencies ∨ */
const UserTypeConfig = {
    name: 'UserType',
    fields: () => ({
        id: { type: UUIDType },
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
        profile: { type: ProfileType },
        posts: { type: new GraphQLList(PostType) },
        userSubscribedTo: { type: new GraphQLObjectType(UserTypeConfig) },
        subscribedToUser: { type: new GraphQLObjectType(UserTypeConfig) },
    }),
}
/* ^ Crutch to avoid circular dependencies ^ */

export { UserTypeConfig };