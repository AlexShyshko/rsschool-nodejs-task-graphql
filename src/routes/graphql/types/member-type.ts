import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLInt } from 'graphql';

interface MemberType {
    id: 'BASIC' | 'BUSINESS';
    discount: number;
    postsLimitPerMonth: number;
}

const MemberType_GQL = new GraphQLObjectType({
    name: 'MemberType_GQL',
    fields: () => ({
        id: { type: GraphQLString },
        discount: { type: GraphQLFloat },
        postsLimitPerMonth: { type: GraphQLInt },
    })
});

export type { MemberType };
export { MemberType_GQL };
