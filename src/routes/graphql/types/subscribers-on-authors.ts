
import { GraphQLObjectType } from 'graphql';
import { getUserId, getUserType } from './user.js';

let getSubscribersOnAuthorsType: () => GraphQLObjectType<unknown, unknown>;
const setSubscribersOnAuthorsTypeGetter = (getter: () => GraphQLObjectType<unknown, unknown>) => { getSubscribersOnAuthorsType = getter };
const subscribersOnAuthorsConfig = {
    name: 'SubscribersOnAuthorsType',
    fields: () => ({
        subscriber: { type: getUserType() },
        subscriberId: { type: getUserId() },
        author: { type: getUserType() },
        authorId: { type: getUserId() },
    }),
};
const SubscribersOnAuthorsType = new GraphQLObjectType(subscribersOnAuthorsConfig);
setSubscribersOnAuthorsTypeGetter(() => { return SubscribersOnAuthorsType });

export { getSubscribersOnAuthorsType };
