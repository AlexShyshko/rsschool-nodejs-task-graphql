import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
} from 'graphql';

const oneStatTypeConfig = {
    name: 'OneStatType',
    fields: () => ({
        model: { type: GraphQLString },
        operation: { type: GraphQLString },
        args: { type: GraphQLString },
    }),
};
const OneStatType = new GraphQLObjectType(oneStatTypeConfig);

let getStatsType: () => GraphQLObjectType<unknown, unknown>;
const setStatsTypeGetter = (getter: () => GraphQLObjectType<unknown, unknown>) => { getStatsType = getter };
const statsTypeConfig = {
    name: 'StatsType',
    fields: () => ({
        operationHistory: { type: new GraphQLList(OneStatType) },
    }),
};
const StatsType = new GraphQLObjectType(statsTypeConfig);
setStatsTypeGetter(() => { return StatsType });

export { getStatsType };
