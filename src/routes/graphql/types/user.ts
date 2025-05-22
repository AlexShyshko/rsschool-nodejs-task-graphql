import {
    GraphQLObjectType,
} from 'graphql';
import { UserTypeConfig } from './user-generic.js';

const UserType = new GraphQLObjectType(UserTypeConfig);
/* ∨ Crutch to avoid circular dependencies ∨ */
/* ^ Crutch to avoid circular dependencies ^ */

export { UserType };