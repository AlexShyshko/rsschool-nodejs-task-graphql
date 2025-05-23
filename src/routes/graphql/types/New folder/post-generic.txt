import {
    GraphQLObjectTypeConfig,
    GraphQLObjectType,
    GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
//import { UserTypeConfig } from './user-generic.js';

let getUserType: () => GraphQLObjectType<unknown, unknown>;

//const UserType = new GraphQLObjectType(UserTypeConfig as GraphQLObjectTypeConfig<unknown, unknown>);

const PostTypeConfig = {
    name: 'PostType',
    fields: () => ({
        id: { type: UUIDType },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        author: { type: getUserType() },
        authorId: { type: getUserType().getFields().id.type },
    }),
};


const setUserTypeGetter = (getter: () => GraphQLObjectType<unknown, unknown>) => { getUserType = getter; };


export { PostTypeConfig, setUserTypeGetter };