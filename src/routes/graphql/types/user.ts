
import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLList,
    GraphQLScalarType,
    GraphQLInputObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { getProfileType } from './profile.js';
import { getPostType } from './post.js';
import { Prisma, Profile as ProfilePrismaType, Post as PostPrismaType, User as UserPrismaType } from '@prisma/client';
import DataLoader from 'dataloader';

let profileLoader: DataLoader<string, ProfilePrismaType>;
function setProfileLoader(loader: DataLoader<string, ProfilePrismaType>) {
    profileLoader = loader;
}
let postsLoader: DataLoader<string, PostPrismaType[]>;
function setPostLoader(loader: DataLoader<string, PostPrismaType[]>) {
    postsLoader = loader;
}
let userSubscribedToLoader: DataLoader<string, UserPrismaType[]>;
function setUserSubscribedToLoader(loader: DataLoader<string, UserPrismaType[]>) {
    userSubscribedToLoader = loader;
}
let subscribedToUserLoader: DataLoader<string, UserPrismaType[]>;
function setSubscribedToUserLoader(loader: DataLoader<string, UserPrismaType[]>) {
    subscribedToUserLoader = loader;
}

let getUserId: () => GraphQLScalarType<string | undefined, string>;
const setUserIdGetter = (getter: () => GraphQLScalarType<string | undefined, string>) => { getUserId = getter };
const UserId = UUIDType;
setUserIdGetter(() => { return UserId });

let getUserType: () => GraphQLObjectType<unknown, unknown>;
const setUserTypeGetter = (getter: () => GraphQLObjectType<unknown, unknown>) => { getUserType = getter };
const userTypeConfig = {
    name: 'User',
    fields: () => ({
        id: { type: UserId },
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
        profile: {
            type: getProfileType(),
            resolve: async (parent: Prisma.UserCreateInput, _args, _context, _info) => {
                const profileBatch = await profileLoader.load(parent.id as string);
                //profileLoader.prime(parent.id!, profileBatch);
                return profileBatch;
            },
        },
        posts: {
            type: new GraphQLList(getPostType()),
            resolve: async (parent: Prisma.UserCreateInput, _args, _context, _info) => {
                const postsBatch = await postsLoader.load(parent.id as string);
                //postsLoader.prime(parent.id!, postsBatch);
                return postsBatch;
            },
        },
        userSubscribedTo: {
            type: new GraphQLList(getUserType()),
            resolve: async (parent: Prisma.UserCreateInput & { userSubscribedTo: Prisma.UserCreateInput[] }, _args, _context, _info) => {
                const userSubscribedToBatch = await userSubscribedToLoader.load(parent.id as string);
                //userSubscribedToLoader.prime(parent.id!, userSubscribedToBatch);
                return userSubscribedToBatch;
            },
        },
        subscribedToUser: {
            type: new GraphQLList(getUserType()),
            resolve: async (parent: Prisma.UserCreateInput, _args, _context, _info) => {
                const subscribedToUserBatch = await subscribedToUserLoader.load(parent.id as string);
                //subscribedToUserLoader.prime(parent.id!, subscribedToUserBatch);
                return subscribedToUserBatch;
            },
        },
    }),
}
const User = new GraphQLObjectType(userTypeConfig);
setUserTypeGetter(() => { return User as GraphQLObjectType<unknown, unknown> });

let getUserPostInputType: () => GraphQLInputObjectType;
const setUserPostInputTypeGetter = (getter: () => GraphQLInputObjectType) => { getUserPostInputType = getter };
const userPostInputTypeConfig = {
    name: 'CreateUserInput',
    fields: () => ({
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
    }),
};
const CreateUserInput = new GraphQLInputObjectType(userPostInputTypeConfig);
setUserPostInputTypeGetter(() => { return CreateUserInput });

let getUserPatchInputType: () => GraphQLInputObjectType;
const setUserPatchInputTypeGetter = (getter: () => GraphQLInputObjectType) => { getUserPatchInputType = getter };
const userPatchInputTypeConfig = {
    name: 'ChangeUserInput',
    fields: () => ({
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
    }),
};
const ChangeUserInput = new GraphQLInputObjectType(userPatchInputTypeConfig);
setUserPatchInputTypeGetter(() => { return ChangeUserInput });

export {
    getUserId,
    getUserType,
    getUserPostInputType,
    getUserPatchInputType,
    setProfileLoader,
    setPostLoader,
    setUserSubscribedToLoader,
    setSubscribedToUserLoader,
};