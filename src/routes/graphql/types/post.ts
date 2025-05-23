import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInputObjectType,
    GraphQLScalarType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { getUserId, getUserType } from './user.js';

let getPostId: () => GraphQLScalarType<string | undefined, string>;
const setPostIdGetter = (getter: () => GraphQLScalarType<string | undefined, string>) => { getPostId = getter };
const PostId = UUIDType;
setPostIdGetter(() => { return PostId });

let getPostType: () => GraphQLObjectType<unknown, unknown>;
const setPostTypeGetter = (getter: () => GraphQLObjectType<unknown, unknown>) => { getPostType = getter };
const postTypeConfig = {
    name: 'PostType',
    fields: () => ({
        id: { type: PostId },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        author: { type: getUserType() },
        authorId: { type: getUserId() },
    }),
};
const PostType = new GraphQLObjectType(postTypeConfig);
setPostTypeGetter(() => { return PostType });

let getPostPostInputType: () => GraphQLInputObjectType;
const setPostPostInputTypeGetter = (getter: () => GraphQLInputObjectType) => { getPostPostInputType = getter };
const postPostInputTypeConfig = {
    name: 'PostPostInputType',
    fields: () => ({
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        authorId: { type: getUserId() },
    }),
};
const PostPostInputType = new GraphQLInputObjectType(postPostInputTypeConfig);
setPostPostInputTypeGetter(() => { return PostPostInputType });

let getPostPatchInputType: () => GraphQLInputObjectType;
const setPostPatchInputTypeGetter = (getter: () => GraphQLInputObjectType) => { getPostPatchInputType = getter };
const postPatchInputTypeConfig = {
    name: 'PostPatchInputType',
    fields: () => ({
        title: { type: GraphQLString },
        content: { type: GraphQLString },
    }),
};
const PostPatchInputType = new GraphQLInputObjectType(postPatchInputTypeConfig);
setPostPatchInputTypeGetter(() => { return PostPatchInputType });

export { getPostId, getPostType, getPostPostInputType, getPostPatchInputType };
