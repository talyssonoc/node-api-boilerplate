type Schema<Q = any, M = any> = {
  queries: Q;
  mutations: M;
};

type AddToSchema = (schemaData: Schema) => void 
type GetSchemaData = () => Schema;

type MakeSchemaStorage = {
  getSchemaData: GetSchemaData;
  addToSchema: AddToSchema;
}

const makeSchemaStorage = (): MakeSchemaStorage => {
  let queries = {};
  let mutations = {};

  return {
    getSchemaData: () => ({ queries, mutations }),
    addToSchema: (schemaData: Schema): void => {
      queries = { ...queries, ...schemaData.queries };
      mutations = { ...mutations, ...schemaData.mutations };
    },
  };
};

type Dependencies = {
  addToSchema: AddToSchema;
};

const withSchemaRegister =
  (schemaData: Schema) =>
  ({ addToSchema }: Dependencies): void =>
  addToSchema(schemaData);

export { makeSchemaStorage, withSchemaRegister };
export type { AddToSchema }
