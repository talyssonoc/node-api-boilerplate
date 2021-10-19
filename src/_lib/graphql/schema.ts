type Schema<Q = any, M = any> = {
  queries: Q;
  mutations: M;
};

type RegisterSchema = (schemaData: Schema) => void 
type GetSchemaData = () => Schema;

type MakeSchemaStorage = {
  getSchemaData: GetSchemaData;
  registerSchema: RegisterSchema;
}

const makeSchemaStorage = (): MakeSchemaStorage => {
  let queries = {};
  let mutations = {};

  return {
    getSchemaData: () => ({ queries, mutations }),
    registerSchema: (schemaData: Schema): void => {
      queries = { ...queries, ...schemaData.queries };
      mutations = { ...mutations, ...schemaData.mutations };
    },
  };
};

type Dependencies = {
  registerSchema: RegisterSchema;
};

const withSchemaRegister =
  (schemaData: Schema) =>
  ({ registerSchema }: Dependencies): void =>
    registerSchema(schemaData);

export { makeSchemaStorage, withSchemaRegister };
export type { RegisterSchema }
