



/**
 * A superclass for the basic sequelize operations based on models and
 */
class SequelizeobjectsRepository {
  constructor(Model, Mapper) {
    this.localModel = Model;
    this.localMapper = Mapper;

  }

  /**
   * parameters are sequelize query parameters
   * @param args
   * will return a promise that resolves an object of the specified model
   * @returns {Promise<any[]>}
   */
  async getAll(...args) {
    const objects = await this.localModel.findAll(...args);

    return objects.map(this.localMapper.toEntity);
  }

  /**
   *
   * @param id
   * will return a promise that resolves an object of the specified model
   * @returns {Promise<*>}
   */
  async getById(id) {
    const object = await this._getById(id);

    return this.localMapper.toEntity(object);
  }

  /**
   * parameters are the attribute that should query by and its value
   * @param attribute
   * @param value
   * will return a promise that resolves an object of the specified model
   * @returns {Promise<*>}
   */
  async getByAttribute(attribute, value){
    const object = await this._getBy(attribute, value);

    return this.localMapper.toEntity(object);
  }

  /**
   * will add a new object record to storage
   * object parameter should be a structure object and should have the
   * validate method in its prototype. see structure on npmjs.
   * @param object
   * will return a promise that resolves an object of the specified model
   * @returns {Promise<*>}
   */
  async add(object) {
    const { valid, errors } = object.validate();

    if(!valid) {
      const error = new Error('ValidationError');
      error.details = errors;

      throw error;
    }

    const newobject = await this.localModel.create(this.localMapper.toDatabase(object));
    return this.localMapper.toEntity(newobject);
  }

  /**
   * Will remove a record form the storage
   * @param id
   * will return a promise that resolves when the action is complete
   * @returns {Promise<void>}
   * @throws NotFoundError | any
   */
  async remove(id) {
    const object = await this._getById(id);

    await object.destroy();
    return;
  }

  /**
   *
   * @param id
   * @param newData
   * will return a promise that resolves an object of the specified updated model
   * @returns {Promise<*>}
   * @throws NotFoundError | any
   */
  async update(id, newData) {
    const object = await this._getById(id);

    const transaction = await this.localModel.sequelize.transaction();

    try {
      const updatedobject = await object.update(newData, { transaction });
      const objectEntity = this.localMapper.toEntity(updatedobject);

      const { valid, errors } = objectEntity.validate();

      if(!valid) {
        const error = new Error('ValidationError');
        error.details = errors;

        throw error;
      }

      await transaction.commit();

      return objectEntity;
    } catch(error) {
      await transaction.rollback();

      throw error;
    }
  }

  /**
   * Will count the number of records of the specified model
   * will return a promise that resolves to a number
   * @returns {Promise<*>}
   */
  async count() {
    return await this.localModel.count();
  }

  // Private

  /**
   * Private internal function
   * @param id
   * will return a promise that resolves an object of the specified model
   * @returns {Promise<Instance>}
   * @private
   */
  async _getById(id) {
    try {
      return await this.localModel.findById(id, { rejectOnEmpty: true });
    } catch(error) {
      if(error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `object with id ${id} can't be found.`;

        throw notFoundError;
      }

      throw error;
    }
  }


  /**
   * Private internal function
   * @param attribute
   * @param value
   * will return a promise that resolves an object of the specified model
   * @returns {Promise<Instance>}
   * @private
   */
  async _getBy(attribute, value) {
    try {
      let options = {};
      options[attribute]=value;
      return await this.localModel.findAll({
        where:options,
        rejectOnEmpty: true
      });
    } catch(error) {
      if(error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `object with attribute ${attribute} and value ${value} can't be found.`;

        throw notFoundError;
      }

      throw error;
    }
  }
}

module.exports = SequelizeobjectsRepository;
