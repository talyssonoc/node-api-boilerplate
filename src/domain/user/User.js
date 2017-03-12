const { attributes } = require('structure');

const User = attributes({
  id: Number,
  name: {
    type: String,
    required: true
  }
})(class User {
  getInitial() {
    if(!this.name) {
      return '';
    }

    return this.name.charAt(0);
  }
});

module.exports = User;
