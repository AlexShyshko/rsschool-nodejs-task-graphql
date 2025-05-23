import {
    GraphQLObjectTypeConfig,
    GraphQLOutputType,
    GraphQLObjectType,
    GraphQLBoolean,
    GraphQLInt,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { UserTypeConfig } from './user-generic.js';
// import { setProfileTypeGetter } from './member-type-generic.js';

let getUserType: () => GraphQLObjectType<unknown, unknown>;
let getMemberType: () => GraphQLObjectType<unknown, unknown>;
//const UserType = new GraphQLObjectType(UserTypeConfig as GraphQLObjectTypeConfig<unknown, unknown>);
//const MemberTypeType = new GraphQLObjectType(MemberTypeConfig as GraphQLObjectTypeConfig<unknown, unknown>);

const ProfileTypeConfig = {
    name: 'ProfileType',
    fields: () => ({
        id: { type: UUIDType },
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        user: { type: getUserType() },
        userId: { type: getUserType().getFields().id.type  },
        memberType: { type: getMemberType() },
        memberTypeId: { type: getMemberType().getFields().id.type },
    }),
};

const setUserTypeGetter = (getter: () => GraphQLObjectType<unknown, unknown>) => { getUserType = getter };
const setMemberTypeGetter = (getter: () => GraphQLObjectType<unknown, unknown>) => { getMemberType = getter };

export { ProfileTypeConfig, setUserTypeGetter, setMemberTypeGetter };
