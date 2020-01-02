module.exports = {
  web: {
    port: process.env.PORT
  },
  logging: {
    appenders: [
      { type: 'console', layout: { type: 'basic' } }
    ]
  }
};
