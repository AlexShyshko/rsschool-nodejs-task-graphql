import {
    GraphQLEnumType,
    GraphQLObjectType,
    GraphQLFloat,
    GraphQLInt,
    GraphQLList,
} from 'graphql';
import { ProfileType } from './profile.js';

let getProfileType: () => GraphQLObjectType<unknown, unknown>;

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
        //profiles: { type: new GraphQLList(ProfileType) },
        profiles: { type: new GraphQLList(getProfileType()) },
    }),
};

const setProfileTypeGetter = (getter: () => GraphQLObjectType<unknown, unknown>) => { getProfileType = getter; };

export { MemberTypeIdConfig, MemberTypeConfig, setProfileTypeGetter  };
