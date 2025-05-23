
import { GraphQLObjectType } from 'graphql';

// Define the getter function for UserType
let getUserType: () => GraphQLObjectType<unknown, unknown>;

// Define the SubscribersOnAuthorsConfig with circular dependency handling
const SubscribersOnAuthorsConfig = {
    name: 'SubscribersOnAuthorsType',
    fields: () => ({
        subscriber: { type: getUserType() },
        subscriberId: { type: getUserType().getFields().id.type },
        author: { type: getUserType() },
        authorId: { type: getUserType().getFields().id.type },
    }),
};

// Define the setter function for UserType
const setUserTypeGetter = (getter: () => GraphQLObjectType<unknown, unknown>) => {
    getUserType = getter;
};

// Export the config and setter function
export { SubscribersOnAuthorsConfig, setUserTypeGetter };
