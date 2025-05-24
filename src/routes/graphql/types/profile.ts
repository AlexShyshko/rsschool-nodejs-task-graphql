import {
    GraphQLObjectType,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLScalarType,
    GraphQLInputObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { getUserId/*, getUserType*/ } from './user.js';
import { getMemberTypeId, getMemberTypeType } from './member-type.js';

let getProfileId: () => GraphQLScalarType<string | undefined, string>;
const setProfileIdGetter = (getter: () => GraphQLScalarType<string | undefined, string>) => { getProfileId = getter };
const ProfileId = UUIDType;
setProfileIdGetter(() => { return ProfileId });

let getProfileType: () => GraphQLObjectType<unknown, unknown>;
const setProfileTypeGetter = (getter: () => GraphQLObjectType<unknown, unknown>) => { getProfileType = getter };
const profileTypeConfig = {
    name: 'Profile',
    fields: () => ({
        id: { type: ProfileId },
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        // user: { type: getUserType() },
        // userId: { type: getUserId() },
        memberType: { type: getMemberTypeType() },
        // memberTypeId: { type: getMemberTypeId() },
    }),
};
const Profile = new GraphQLObjectType(profileTypeConfig);
setProfileTypeGetter(() => { return Profile });

let getProfilePostInputType: () => GraphQLInputObjectType;
const setProfilePostInputTypeGetter = (getter: () => GraphQLInputObjectType) => { getProfilePostInputType = getter };
const profilePostInputTypeConfig = {
    name: 'CreateProfileInput',
    fields: () => ({
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        userId: { type: getUserId() },
        memberTypeId: { type: getMemberTypeId() },
    }),
};
const CreateProfileInput = new GraphQLInputObjectType(profilePostInputTypeConfig);
setProfilePostInputTypeGetter(() => { return CreateProfileInput });

let getProfilePatchInputType: () => GraphQLInputObjectType;
const setProfilePatchInputTypeGetter = (getter: () => GraphQLInputObjectType) => { getProfilePatchInputType = getter };
const profilePatchInputTypeConfig = {
    name: 'ChangeProfileInput',
    fields: () => ({
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        memberTypeId: { type: getMemberTypeId() },
    }),
};
const ChangeProfileInput = new GraphQLInputObjectType(profilePatchInputTypeConfig);
setProfilePatchInputTypeGetter(() => { return ChangeProfileInput });

export { getProfileId, getProfileType, getProfilePostInputType, getProfilePatchInputType };
