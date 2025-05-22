import {
    GraphQLEnumType,
    GraphQLObjectType,
    GraphQLFloat,
    GraphQLInt,
    GraphQLList,
} from 'graphql';
import { MemberTypeIdConfig, MemberTypeConfig } from './member-type-generic.js'
import { ProfileType } from './profile.js';

const MemberTypeId = new GraphQLEnumType(MemberTypeIdConfig);
const MemberTypeType = new GraphQLObjectType(MemberTypeConfig);

export { MemberTypeId, MemberTypeType };
