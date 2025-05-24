
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
import { Prisma, PrismaClient } from '@prisma/client';

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
            resolve: (parent: Prisma.UserMinAggregateOutputType, _args, context: PrismaClient, _info) => {
                return context.profile.findUnique({
                    include: { memberType: true },
                    where: { userId: parent.id! },
                });
            },
        },
        posts: {
            type: new GraphQLList(getPostType()),
            resolve: (parent: Prisma.UserMinAggregateOutputType, _args, context: PrismaClient, _info) => {
                return context.post.findMany({
                    where: { authorId: parent.id! },
                });
            },
        },
        userSubscribedTo: {
            type: new GraphQLList(getUserType()),
            resolve: async (parent: Prisma.UserMinAggregateOutputType, _args, context: PrismaClient, _info) => {
                const subscriptions = await context.subscribersOnAuthors.findMany({
                    include: { subscriber: true, author: true },
                    where: { subscriberId: parent.id! },
                });
                return subscriptions.map(async (subscription) => {
                    return await context.user.findUnique({
                        include: { profile: true, posts: true, userSubscribedTo: true, subscribedToUser: true },
                        where: { id: subscription.authorId },
                    });
                });
            },
        },
        subscribedToUser: {
            type: new GraphQLList(getUserType()),
            resolve: async (parent: Prisma.UserMinAggregateOutputType, _args, context: PrismaClient, _info) => {
                const subscribers = await context.subscribersOnAuthors.findMany({
                    include: { subscriber: true, author: true },
                    where: { authorId: parent.id! },
                });
                return subscribers.map(async (subscription) => {
                    return await context.user.findUnique({
                        include: { profile: true, posts: true, userSubscribedTo: true, subscribedToUser: true },
                        where: { id: subscription.subscriberId },
                    });
                });
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

export { getUserId, getUserType, getUserPostInputType, getUserPatchInputType };
