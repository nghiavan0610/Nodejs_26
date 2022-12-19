const siteRouter = require('./site');
const meRouter = require('./me');
const restaurantsRouter = require('./restaurants');
const usersRouter = require('./users');

const {notFound, errorHandler} = require('../middleware/Errors')

function route(app) {
  app.use('/restaurants', restaurantsRouter);
  app.use('/users', usersRouter);
  app.use('/me', meRouter);

  app.use('/', siteRouter);

  app.use(notFound);
  app.use(errorHandler);
}

module.exports = route;
