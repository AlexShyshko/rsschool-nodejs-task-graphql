import { PrismaClient, Profile, Post, User, MemberType } from '@prisma/client';
import DataLoader from 'dataloader';

function getProfileLoader(prismaInstance: PrismaClient) {

    return new DataLoader<string, Profile>(async (usersIdArray) => {

        const loadedProfiles: Array<Profile> = [];

        await prismaInstance.profile.findMany({
            include: { memberType: true },
            where: { userId: { in: [...usersIdArray] } },
        }).then((queriedProfiles) => {

            const mapProfiles: Map<string, Profile> = new Map();
            queriedProfiles.forEach((profile) => {
                mapProfiles.set(profile.userId, profile);
            });

            usersIdArray.forEach((userId) => {
                loadedProfiles.push(mapProfiles.get(userId) as Profile);
            });

        });

        return loadedProfiles;

    });

};

function getPostsLoader(prismaInstance: PrismaClient) {

    return new DataLoader<string, Array<Post>>(async (usersIdArray) => {

        const loadedPosts: Array<Array<Post>> = [];

        await prismaInstance.post.findMany({
            where: { authorId: { in: [...usersIdArray] } },
        }).then((queriedPosts) => {

            const mapPosts: Map<string, Array<Post>> = new Map();
            queriedPosts.forEach((post) => {
                const mappedUserPosts = mapPosts.get(post.authorId) || [];
                mappedUserPosts.push(post);
                mapPosts.set(post.authorId, mappedUserPosts);
            });

            usersIdArray.forEach((userId) => {
                loadedPosts.push(mapPosts.get(userId) || []);
            });

        });

        return loadedPosts;

    });

};

function getUserSubscribedToLoader(prismaInstance: PrismaClient) {

    return new DataLoader<string, Array<User>>(async (userIdsArray) => {

        const loadedSubscriptions: Array<Array<User>> = [];         

        const subscriptions = await prismaInstance.subscribersOnAuthors.findMany({
            include: { author: true },
            where: { subscriberId: { in: [...userIdsArray] } },
        });

        const mapAuthors: Map<string, Array<User>> = new Map();
        userIdsArray.forEach((userId) => mapAuthors.set(userId, []));

        subscriptions.forEach((subscription) => {
            const author = subscription.author;
            if (author) {
                const mappedUserSubscriptions = mapAuthors.get(subscription.subscriberId) || [];
                mappedUserSubscriptions.push(author);
                mapAuthors.set(subscription.subscriberId, mappedUserSubscriptions);
            }
        });

        userIdsArray.forEach((userId) => {
            loadedSubscriptions.push(mapAuthors.get(userId) || []);
        });

        return loadedSubscriptions;

    });

}

function getSubscribedToUserLoader(prismaInstance: PrismaClient) {

    return new DataLoader<string, Array<User>>(async (userIdsArray) => {

        const loadedSubscribers: Array<Array<User>> = [];         

        const subscriptions = await prismaInstance.subscribersOnAuthors.findMany({
            include: { subscriber: true }, 
            where: { authorId: { in: [...userIdsArray] } },
        });

        const mapSubscribers: Map<string, Array<User>> = new Map();
        userIdsArray.forEach((userId) => mapSubscribers.set(userId, []));

        subscriptions.forEach((subscription) => {
            const subscriber = subscription.subscriber;
            if (subscriber) {
                const mappedUserSubscribers = mapSubscribers.get(subscription.authorId) || [];
                mappedUserSubscribers.push(subscriber);
                mapSubscribers.set(subscription.authorId, mappedUserSubscribers);
            }
        });

        userIdsArray.forEach((userId) => {
            loadedSubscribers.push(mapSubscribers.get(userId) || []);
        });

        return loadedSubscribers;

    });

}

function getMemberTypeLoader(prismaInstance: PrismaClient) {

    return new DataLoader<string, MemberType>(async (profilesIdArray) => {

        const loadedMemberTypes: Array<MemberType> = [];

        await prismaInstance.memberType.findMany({
            include: { profiles: true },
        }).then((queriedMemberTypes) => {

            const mapMemberTypes: Map<string, MemberType> = new Map();
            const mapProfiles: Map<string, string> = new Map();
            queriedMemberTypes.forEach((memberType) => {
                mapMemberTypes.set(memberType.id, memberType);
                memberType.profiles.forEach((profile) => {
                    mapProfiles.set(profile.id, profile.memberTypeId);
                });
            });

            profilesIdArray.forEach((profileId) => {
                const memberTypeId = mapProfiles.get(profileId);
                loadedMemberTypes.push(mapMemberTypes.get(memberTypeId as string) as MemberType);
            });

        });

        return loadedMemberTypes;

    });

};

export {
    getProfileLoader,
    getPostsLoader,
    getUserSubscribedToLoader,
    getSubscribedToUserLoader,
    getMemberTypeLoader,
};