const siteRouter = require('./site');
const meRouter = require('./me');
const restaurantsRouter = require('./restaurants');
const usersRouter = require('./users');

function route(app) {
  app.use('/restaurants', restaurantsRouter);
  app.use('/users', usersRouter);
  app.use('/me', meRouter);

  app.use('/', siteRouter);
}

module.exports = route;
