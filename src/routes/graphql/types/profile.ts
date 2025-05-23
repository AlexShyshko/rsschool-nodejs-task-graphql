import {
    GraphQLObjectType,
    GraphQLBoolean,
    GraphQLInt,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { getUserId, getUserType } from './user.js';
import { getMemberTypeId, getMemberTypeType } from './member-type.js';

let getProfileType: () => GraphQLObjectType<unknown, unknown>;
const setProfileTypeGetter = (getter: () => GraphQLObjectType<unknown, unknown>) => { getProfileType = getter };
const profileTypeConfig = {
    name: 'ProfileType',
    fields: () => ({
        id: { type: UUIDType },
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        user: { type: getUserType() },
        userId: { type: getUserId() },
        memberType: { type: getMemberTypeType() },
        memberTypeId: { type: getMemberTypeId() },
    }),
};
const ProfileType = new GraphQLObjectType(profileTypeConfig);
setProfileTypeGetter(() => { return ProfileType });

export { getProfileType };
