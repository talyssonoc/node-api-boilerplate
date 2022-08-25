type PartializeProperties<Type, Properties extends keyof Type> = Omit<Type, Properties> &
  Partial<Pick<Type, Properties>>;

export { PartializeProperties };
