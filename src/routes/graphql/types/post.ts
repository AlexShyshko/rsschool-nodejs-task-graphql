import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInputObjectType,
    GraphQLScalarType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { getUserId/*, getUserType*/ } from './user.js';

let getPostId: () => GraphQLScalarType<string | undefined, string>;
const setPostIdGetter = (getter: () => GraphQLScalarType<string | undefined, string>) => { getPostId = getter };
const PostId = UUIDType;
setPostIdGetter(() => { return PostId });

let getPostType: () => GraphQLObjectType<unknown, unknown>;
const setPostTypeGetter = (getter: () => GraphQLObjectType<unknown, unknown>) => { getPostType = getter };
const postTypeConfig = {
    name: 'Post',
    fields: () => ({
        id: { type: PostId },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        // author: { type: getUserType() },
        // authorId: { type: getUserId() },
    }),
};
const Post = new GraphQLObjectType(postTypeConfig);
setPostTypeGetter(() => { return Post });

let getPostPostInputType: () => GraphQLInputObjectType;
const setPostPostInputTypeGetter = (getter: () => GraphQLInputObjectType) => { getPostPostInputType = getter };
const postPostInputTypeConfig = {
    name: 'CreatePostInput',
    fields: () => ({
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        authorId: { type: getUserId() },
    }),
};
const CreatePostInput = new GraphQLInputObjectType(postPostInputTypeConfig);
setPostPostInputTypeGetter(() => { return CreatePostInput });

let getPostPatchInputType: () => GraphQLInputObjectType;
const setPostPatchInputTypeGetter = (getter: () => GraphQLInputObjectType) => { getPostPatchInputType = getter };
const postPatchInputTypeConfig = {
    name: 'ChangePostInput',
    fields: () => ({
        title: { type: GraphQLString },
        content: { type: GraphQLString },
    }),
};
const ChangePostInput = new GraphQLInputObjectType(postPatchInputTypeConfig);
setPostPatchInputTypeGetter(() => { return ChangePostInput });

export { getPostId, getPostType, getPostPostInputType, getPostPatchInputType };
