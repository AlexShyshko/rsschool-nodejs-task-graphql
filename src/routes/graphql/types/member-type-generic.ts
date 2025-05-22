import {
    GraphQLEnumType,
    GraphQLObjectType,
    GraphQLFloat,
    GraphQLInt,
    GraphQLList,
} from 'graphql';
import { ProfileType } from './profile.js';

const MemberTypeIdConfig = {
    name: 'MemberTypeId',
    values: {
        BASIC: { value: 'BASIC' },
        BUSINESS: { value: 'BUSINESS' },
    },
};

const MemberTypeConfig = {
    name: 'MemberTypeType',
    fields: () => ({
        id: { type: new GraphQLEnumType(MemberTypeIdConfig) },
        discount: { type: GraphQLFloat },
        postsLimitPerMonth: { type: GraphQLInt },
        profiles: { type: new GraphQLList(ProfileType) },
    }),
};

export { MemberTypeIdConfig, MemberTypeConfig };
