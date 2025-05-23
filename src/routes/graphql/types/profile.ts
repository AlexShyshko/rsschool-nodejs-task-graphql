import {
    GraphQLObjectType,
    GraphQLBoolean,
    GraphQLInt,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { getUserType } from './user.js';
import { getMemberTypeType } from './member-type.js';

let getProfileType: () => GraphQLObjectType<unknown, unknown>;
const setProfileTypeGetter = (getter: () => GraphQLObjectType<unknown, unknown>) => { getProfileType = getter };
const profileTypeConfig = {
    name: 'ProfileType',
    fields: () => ({
        id: { type: UUIDType },
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        user: { type: getUserType() },
        userId: { type: getUserType().getFields().id.type  },
        memberType: { type: getMemberTypeType() },
        memberTypeId: { type: getMemberTypeType().getFields().id.type },
    }),
};
const ProfileType = new GraphQLObjectType(profileTypeConfig);
setProfileTypeGetter(() => { return ProfileType });

export { getProfileType };
