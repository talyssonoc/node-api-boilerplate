const UserSerializer = {
  serialize({ id, name }) {
    return {
      id,
      name
    };
  }
};

module.exports = UserSerializer;
