import {
    GraphQLObjectTypeConfig,
    GraphQLOutputType,
    GraphQLObjectType,
    GraphQLBoolean,
    GraphQLInt,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileTypeConfig } from './profile-generic.js';
import { UserTypeConfig } from './user-generic.js';
import { MemberTypeIdConfig, MemberTypeConfig } from './member-type-generic.js';

const UserType = new GraphQLObjectType(UserTypeConfig as GraphQLObjectTypeConfig<unknown, unknown>);
const MemberTypeType = new GraphQLObjectType(MemberTypeConfig as GraphQLObjectTypeConfig<unknown, unknown>);


const ProfileType = new GraphQLObjectType(ProfileTypeConfig);

export { ProfileType };