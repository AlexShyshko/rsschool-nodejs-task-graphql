import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLList
} from 'graphql';
import { ProfileTypeConfig } from './profile-generic.js';
import { PostTypeConfig } from './post-generic.js';
import { SubscribersOnAuthorsConfig } from './subscribers-on-authors-generic.js';
import { UUIDType } from './uuid.js';
//import { PostType } from './post.js';

// const PostType = new GraphQLObjectType(PostTypeConfig);
// const ProfileType = new GraphQLObjectType(ProfileTypeConfig);

let getProfileType: () => GraphQLObjectType<unknown, unknown>;
let getPostType: () => GraphQLObjectType<unknown, unknown>;
let getSubscribersOnAuthorsType: () => GraphQLObjectType<unknown, unknown>;



let getUserType: () => GraphQLObjectType<unknown, unknown>;



/* ∨ Crutch to avoid circular dependencies ∨ */
const UserTypeConfig = {
    name: 'UserType',
    fields: () => ({
        id: { type: UUIDType },
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
        // profile: { type: ProfileType },
        // posts: { type: new GraphQLList(PostType) },
        profile: { type: getProfileType() },
        posts: { type: new GraphQLList(getPostType()) },
        userSubscribedTo: { type: getSubscribersOnAuthorsType() },
        subscribedToUser: { type: getSubscribersOnAuthorsType() },
    }),
}
/* ^ Crutch to avoid circular dependencies ^ */

const setProfileTypeGetter = (getter: () => GraphQLObjectType<unknown, unknown>) => { getProfileType = getter; };
const setPostTypeGetter = (getter: () => GraphQLObjectType<unknown, unknown>) => { getPostType = getter; };
const setSubscribersOnAuthorsTypeGetter = (getter: () => GraphQLObjectType<unknown, unknown>) => { getSubscribersOnAuthorsType = getter; };


const setUserTypeGetter = (getter: () => GraphQLObjectType<unknown, unknown>) => { getUserType = getter; };

export { UserTypeConfig, setProfileTypeGetter, setPostTypeGetter, setSubscribersOnAuthorsTypeGetter, setUserTypeGetter };