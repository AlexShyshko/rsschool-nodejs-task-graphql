import {
    GraphQLObjectType,
} from 'graphql';
import { UserTypeConfig, setProfileTypeGetter, setPostTypeGetter, setSubscribersOnAuthorsTypeGetter, setUserTypeGetter } from './user-generic.js';
import { ProfileTypeConfig } from './profile-generic.js';
import { PostTypeConfig } from './post-generic.js';
import { SubscribersOnAuthorsConfig } from './subscribers-on-authors-generic.js';

const UserType = new GraphQLObjectType(UserTypeConfig);
/* ∨ Crutch to avoid circular dependencies ∨ */
/* ^ Crutch to avoid circular dependencies ^ */

const ProfileType = new GraphQLObjectType(ProfileTypeConfig);
const PostType = new GraphQLObjectType(PostTypeConfig);
const SubscribersOnAuthorsType = new GraphQLObjectType(SubscribersOnAuthorsConfig);

setProfileTypeGetter(() => { return ProfileType });
setPostTypeGetter(() => { return PostType });
setSubscribersOnAuthorsTypeGetter(() => { return SubscribersOnAuthorsType });

setUserTypeGetter(() => { return UserType });

export { UserType };