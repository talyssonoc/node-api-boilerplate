type Schema<Q = any, M = any> = {
  queries?: Q;
  mutations?: M;
};

type AddToSchema = (schemaData: Schema) => void 
type GetSchema = () => Schema;

type MakeSchemaStorage = {
  getSchema: GetSchema;
  addToSchema: AddToSchema;
}

const makeSchema = (): MakeSchemaStorage => {
  let queries = {};
  let mutations = {};

  return {
    getSchema: () => ({ queries, mutations }),
    addToSchema: (schemaData: Schema): void => {
      queries = { ...queries, ...schemaData.queries };
      mutations = { ...mutations, ...schemaData.mutations };
    },
  };
};

type Dependencies = {
  addToSchema: AddToSchema;
};

const withRegisterSchema =
  (schemaData: Schema) =>
  ({ addToSchema }: Dependencies): void =>
  addToSchema(schemaData);

export { makeSchema, withRegisterSchema };
export type { AddToSchema }
