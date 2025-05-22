import {
    GraphQLObjectType,
} from 'graphql';
import { UserTypeConfig } from './user-generic.js';

const UserType = new GraphQLObjectType(UserTypeConfig);

const SubscribersOnAuthorsType = new GraphQLObjectType({
  name: 'ProfileType',
  fields: () => ({
    subscriber: { type: UserType },
    subscriberId: { type: UserType.getFields().id.type },
    author: { type: UserType },
    authorId: { type: UserType.getFields().id.type },
  }),
});

export { SubscribersOnAuthorsType };