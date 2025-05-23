
import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLList,
    GraphQLScalarType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { getProfileType } from './profile.js';
import { getPostType } from './post.js';
import { getSubscribersOnAuthorsType } from './subscribers-on-authors.js';

let getUserId: () => GraphQLScalarType<string | undefined, string>;
const setUserIdGetter = (getter: () => GraphQLScalarType<string | undefined, string>) => { getUserId = getter };
const UserId = UUIDType;
setUserIdGetter(() => { return UserId });

let getUserType: () => GraphQLObjectType<unknown, unknown>;
const setUserTypeGetter = (getter: () => GraphQLObjectType<unknown, unknown>) => { getUserType = getter };
const userTypeConfig = {
    name: 'UserType',
    fields: () => ({
        id: { type: UserId },
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
        profile: { type: getProfileType() },
        posts: { type: new GraphQLList(getPostType()) },
        userSubscribedTo: { type: getSubscribersOnAuthorsType() },
        subscribedToUser: { type: getSubscribersOnAuthorsType() },
    }),
}
const UserType = new GraphQLObjectType(userTypeConfig);
setUserTypeGetter(() => { return UserType });

export { getUserId, getUserType };
