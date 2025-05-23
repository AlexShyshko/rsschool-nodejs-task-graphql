import {
    GraphQLObjectTypeConfig,
    GraphQLOutputType,
    GraphQLObjectType,
    GraphQLBoolean,
    GraphQLInt,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileTypeConfig, setUserTypeGetter, setMemberTypeGetter } from './profile-generic.js';
import { UserTypeConfig } from './user-generic.js';
import { MemberTypeIdConfig, MemberTypeConfig } from './member-type-generic.js';




const ProfileType = new GraphQLObjectType(ProfileTypeConfig);

const UserType = new GraphQLObjectType(UserTypeConfig);
const MemberTypeType = new GraphQLObjectType(MemberTypeConfig);

setUserTypeGetter(() => { return UserType });
setMemberTypeGetter(() => { return MemberTypeType });

export { ProfileType };