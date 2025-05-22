import {
    GraphQLObjectTypeConfig,
    GraphQLOutputType,
    GraphQLObjectType,
    GraphQLBoolean,
    GraphQLInt,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { UserTypeConfig } from './user-generic.js';
import { MemberTypeConfig } from './member-type-generic.js';

const UserType = new GraphQLObjectType(UserTypeConfig as GraphQLObjectTypeConfig<unknown, unknown>);
const MemberTypeType = new GraphQLObjectType(MemberTypeConfig as GraphQLObjectTypeConfig<unknown, unknown>);


const ProfileTypeConfig = {
  name: 'ProfileType',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    user: { type: UserType },
    userId: { type: UserType.getFields().id.type  },
    memberType: { type: MemberTypeType },
    memberTypeId: { type: MemberTypeType.getFields().id.type },
  }),
};

export { ProfileTypeConfig };