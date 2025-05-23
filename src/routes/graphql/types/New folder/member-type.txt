import {
    GraphQLEnumType,
    GraphQLObjectType,
    GraphQLFloat,
    GraphQLInt,
    GraphQLList,
} from 'graphql';
import { MemberTypeIdConfig, MemberTypeConfig, setProfileTypeGetter } from './member-type-generic.js'
import { ProfileTypeConfig } from './profile-generic.js';

const MemberTypeId = new GraphQLEnumType(MemberTypeIdConfig);
const MemberTypeType = new GraphQLObjectType(MemberTypeConfig);

const ProfileType = new GraphQLObjectType(ProfileTypeConfig);
setProfileTypeGetter(() => { return ProfileType });

export { MemberTypeId, MemberTypeType };
