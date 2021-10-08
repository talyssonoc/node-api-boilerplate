type SchemaData = {
  queries: any;
  mutations: any;
};

type RegisterSchema = (schemaData: SchemaData) => void 
type GetSchemaData = () => SchemaData;

type MakeSchemaStorage = {
  getSchemaData: GetSchemaData;
  registerSchema: RegisterSchema;
}

const makeSchemaStorage = (): MakeSchemaStorage => {
  let queries = {};
  let mutations = {};

  return {
    getSchemaData: () => ({ queries, mutations }),
    registerSchema: (schemaData: SchemaData): void => {
      queries = { ...queries, ...schemaData.queries };
      mutations = { ...mutations, ...schemaData.mutations };
    },
  };
};

type Dependencies = {
  registerSchema: RegisterSchema;
};

const withSchemaRegister =
  (schemaData: SchemaData) =>
  ({ registerSchema }: Dependencies): void =>
    registerSchema(schemaData);

export { makeSchemaStorage, withSchemaRegister };
export type { RegisterSchema }
