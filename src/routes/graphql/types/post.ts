import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInputObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { getUserType } from './user.js';

let getPostType: () => GraphQLObjectType<unknown, unknown>;
const setPostTypeGetter = (getter: () => GraphQLObjectType<unknown, unknown>) => { getPostType = getter };
const postTypeConfig = {
    name: 'PostType',
    fields: () => ({
        id: { type: UUIDType },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        author: { type: getUserType() },
        authorId: { type: getUserType().getFields().id.type },
    }),
};
const PostType = new GraphQLObjectType(postTypeConfig);
setPostTypeGetter(() => { return PostType });

//const 

export { getPostType };
