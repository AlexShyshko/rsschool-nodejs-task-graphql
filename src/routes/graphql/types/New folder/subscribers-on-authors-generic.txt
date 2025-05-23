import {
    GraphQLObjectType,
} from 'graphql';
//import { UserTypeConfig } from './user-generic.js';

let getUserType: () => GraphQLObjectType<unknown, unknown>;



const SubscribersOnAuthorsConfig = {
  name: 'ProfileType',
  fields: () => ({
    subscriber: { type: getUserType() },
    subscriberId: { type: getUserType().getFields().id.type },
    author: { type: getUserType() },
    authorId: { type: getUserType().getFields().id.type },
  }),
};

const setUserTypeGetter = (getter: () => GraphQLObjectType<unknown, unknown>) => { getUserType = getter; };

export { SubscribersOnAuthorsConfig, setUserTypeGetter };