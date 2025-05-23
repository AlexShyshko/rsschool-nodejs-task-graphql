import {
    GraphQLObjectType,
} from 'graphql';
import { SubscribersOnAuthorsConfig, setUserTypeGetter } from './subscribers-on-authors-generic.js';
import { UserTypeConfig } from './user-generic.js';

const SubscribersOnAuthorsType = new GraphQLObjectType(SubscribersOnAuthorsConfig);

const UserType = new GraphQLObjectType(UserTypeConfig);
setUserTypeGetter(() => { return UserType });

export { SubscribersOnAuthorsType };