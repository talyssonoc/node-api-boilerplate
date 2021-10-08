import { 
  GraphQLEnumType, 
  GraphQLInputObjectType, 
  GraphQLInt, 
  GraphQLList, 
  GraphQLString,
} from "graphql";

const PaginationType = new GraphQLInputObjectType({
  name: 'Pagination',
  fields: () => ({
    page: {
      type: GraphQLInt,
      defaultValue: 1
    },
    pageSize: {
      type: GraphQLInt,
      defaultValue: 10
    }
  })
})

const SortType = GraphQLList(new GraphQLInputObjectType({
  name: 'Sort',
  fields: () => ({
    field: {
      type: GraphQLString,
    },
    direction: {
      type: new GraphQLEnumType({
        name: 'Direction',
        values: {
          asc: { value: 'asc' },
          desc: { value: 'desc' },
        }
      })
    }
  })
}))

export { PaginationType, SortType }