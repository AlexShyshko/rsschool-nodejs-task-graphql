
import {
    GraphQLEnumType,
    GraphQLObjectType,
    GraphQLFloat,
    GraphQLInt,
    GraphQLList,
} from 'graphql';
import { getProfileType } from './profile.js';

let getMemberTypeId: () => GraphQLEnumType;
const setMemberTypeIdGetter = (getter: () => GraphQLEnumType) => { getMemberTypeId = getter };
const MemberTypeIdConfig = {
    name: 'MemberTypeId',
    values: {
        BASIC: { value: 'BASIC' },
        BUSINESS: { value: 'BUSINESS' },
    },
};
const MemberTypeId = new GraphQLEnumType(MemberTypeIdConfig);
setMemberTypeIdGetter(() => { return MemberTypeId });

let getMemberTypeType: () => GraphQLObjectType<unknown, unknown>;
const setMemberTypeTypeGetter = (getter: () => GraphQLObjectType<unknown, unknown>) => { getMemberTypeType = getter };
const memberTypeTypeConfig = {
    name: 'MemberTypeType',
    fields: () => ({
        id: { type: MemberTypeId },
        discount: { type: GraphQLFloat },
        postsLimitPerMonth: { type: GraphQLInt },
        profiles: { type: new GraphQLList(getProfileType()) },
    }),
};
const MemberTypeType = new GraphQLObjectType(memberTypeTypeConfig);
setMemberTypeTypeGetter(() => { return MemberTypeType });

export { getMemberTypeId, getMemberTypeType };
