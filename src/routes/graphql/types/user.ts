
import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLList,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { getProfileType } from './profile.js';
import { getPostType } from './post.js';
import { getSubscribersOnAuthorsType } from './subscribers-on-authors.js';

let getUserType: () => GraphQLObjectType<unknown, unknown>;
const setUserTypeGetter = (getter: () => GraphQLObjectType<unknown, unknown>) => { getUserType = getter };
const userTypeConfig = {
    name: 'UserType',
    fields: () => ({
        id: { type: UUIDType },
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

export { getUserType };
