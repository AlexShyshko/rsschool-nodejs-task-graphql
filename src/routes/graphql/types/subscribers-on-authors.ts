
import { GraphQLObjectType } from 'graphql';
import { getUserType } from './user.js';

let getSubscribersOnAuthorsType: () => GraphQLObjectType<unknown, unknown>;
const setSubscribersOnAuthorsTypeGetter = (getter: () => GraphQLObjectType<unknown, unknown>) => { getSubscribersOnAuthorsType = getter };
const subscribersOnAuthorsConfig = {
    name: 'SubscribersOnAuthorsType',
    fields: () => ({
        subscriber: { type: getUserType() },
        subscriberId: { type: getUserType().getFields().id.type },
        author: { type: getUserType() },
        authorId: { type: getUserType().getFields().id.type },
    }),
};
const SubscribersOnAuthorsType = new GraphQLObjectType(subscribersOnAuthorsConfig);
setSubscribersOnAuthorsTypeGetter(() => { return SubscribersOnAuthorsType });

export { getSubscribersOnAuthorsType };
